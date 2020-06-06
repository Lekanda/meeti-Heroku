const Grupos = require('../models/Grupos');
const Meeti = require('../models/Meeti');
const { body, validationResult } = require('express-validator');

// const { v4: uuidv4 } = require('uuid');
// const uuid = require('uuid/v4');

// Muestra el formulario para nuevos Meetis
exports.formNuevoMeeti = async (req,res,next) => {
    const grupos = await Grupos.findAll({ where: {usuarioId: req.user.id} });
    res.render('nuevo-meeti', {
        nombrePagina: 'Nuevo Meeti',
        grupos
    });
}

// Guarda los Meetis en la DB
exports.crearMeeti = async (req,res,next) => {
    // obtener los datos
    const meeti = req.body;
    console.log(req.body);
    
    // asignar el usuario
    meeti.usuarioId = req.user.id;
    
    // almacena la ubicación con un point
    const point = { type : 'Point', coordinates : [ parseFloat(req.body.lat), parseFloat(req.body.lng) ] };
    meeti.ubicacion = point;

    // cupo opcional
    if(req.body.cupo === '') {
        meeti.cupo = 0;
    }

    // meeti.id = uuid();
    console.log(meeti);

    // almacenar en la BD
    try {
        await Meeti.create(meeti);
        req.flash('exito', 'Se ha creado el Meeti Correctamente');
        res.redirect('/administracion');
    } catch (error) {
        console.log(error);
        // extraer el message de los errores
        const erroresSequelize = error.errors.map(err => err.message);
        req.flash('error', erroresSequelize);
        res.redirect('/nuevo-meeti');
    }

}

// Sanitizar los Meeti
exports.sanitizarMeeti = (req,res,next) => {
    body('titulo');
    body('invitado');
    body('cupo');
    body('fecha');
    body('hora');
    body('direccion');
    body('ciudad');
    body('estado');
    body('pais');
    body('lat');
    body('lng');
    body('grupoId');

    next();
}


// Muestra el formulario para editar un meeti
exports.formEditarMeeti = async (req,res, next) => {
    const consultas = [];
    consultas.push( Grupos.findAll({ where : {usuarioId : req.user.id }}) );
    
    consultas.push( Meeti.findByPk( req.params.id ));

    // Retorna un Promise
    const [grupos, meeti] = await Promise.all(consultas);

    if(!grupos || !meeti){
        req.flash('error', 'Operacion no valida');
        res.redirect('/administracion');
        return next;
    }

    // Mostrar la vista
    res.render('editar-meeti',{
        nombrePagina: `Editar Meeti: ${meeti.titulo}`,
        grupos,
        meeti
    });
    
}

// Guardar cambios en el Meeti editado
exports.editarMeeti = async(req,res,next) => {
    const meeti = await Meeti.findOne({ where : { id : req.params.id, usuarioId : req.user.id}});

    if(!meeti) {
        req.flash('error', 'Operacion no valida');
        res.redirect('/administracion');
        return next;
    }

    // Asignar los valores
    const {grupoId, titulo, invitado, fecha, hora, cupo, descripcion, direccion, ciudad, estado, pais, lat, lng } = req.body;

    // meeti = req.body;
    meeti.grupoId = grupoId;
    meeti.titulo = titulo;
    meeti.invitado = invitado;
    meeti.fecha = fecha;
    meeti.hora = hora;
    meeti.cupo = cupo;
    meeti.descripcion = descripcion;
    meeti.direccion = direccion;
    meeti.ciudad = ciudad;
    meeti.estado = estado;
    meeti.pais = pais;
    
    // Asignar el Point (Ubicacion)
    const point = { type: 'Point', coordinates: [parseFloat(lat), parseFloat(lng)] };
    meeti.ubicacion = point;

    // Almacenar en la DB
    await meeti.save();
    req.flash('exito', 'Cambios guardados correctamente');
    res.redirect('/administracion');
}


// Eliminar el Meeti
exports.formEliminarMeeti = async (req,res,next) => {
    const meeti = await Meeti.findOne({ where : { id : req.params.id, usuarioId : req.user.id}});

    if (!meeti) {
        req.flash('error', 'Operacion no valida');
        res.redirect('/administracion');
        return next();
    }
    // Todo bien, ejecutar la vista
    res.render('eliminar-meeti', {
        nombrePagina : `Eliminar Meeti : ${meeti.titulo} `
    });
}

// POST a eliminar Meeti
exports.eliminarMeeti = async (req,res,next) => {
    const meeti = await Meeti.destroy({ 
        where : { 
            id : req.params.id
        }
    });

    // Redireccionar al usuario
    req.flash('exito', 'Meeti eliminado');
    res.redirect('/administracion');
}

