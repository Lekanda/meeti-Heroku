const Meeti = require('../../models/Meeti');
const Grupos = require('../../models/Grupos');
const Usuarios = require('../../models/Usuarios');
const Categorias = require('../../models/Categorias');
const Comentarios = require('../../models/Comentarios');
const { Op } = require("sequelize");// En curso es diferente


const Sequelize = require('sequelize');

const moment = require('moment');



exports.mostrarMeeti = async (req,res) => {
    const meeti = await Meeti.findOne(
        { where : { 
            slug : req.params.slug
        },
        include : [
            {
                model : Grupos
            },
            {
                model: Usuarios,
                attributes: ['id', 'nombre', 'imagen']
            }
        ]
    });

    // Sí no existe redireccionar
    if (!meeti) {
        res.redirect('/')
    }

    // Consultar por meeti cercanos
    const ubicacion = Sequelize.literal(`ST_GeomFromText('POINT( ${meeti.ubicacion.coordinates[0]} ${meeti.ubicacion.coordinates[1]} )' )`);


    // ST_DISTANCE_Sphere = Retorna una linea en metros
    const distancia = Sequelize.fn('ST_DistanceSphere', Sequelize.col('ubicacion'), ubicacion);


    // Encontrar Meetis cercanos
    const cercanos = await Meeti.findAll({
        order: distancia, // Los ordenadel mas cercano al lejano
        where : Sequelize.where(distancia, { [Op.lte]: 10000 } ), // <= 10 Km
        limit: 3, // 3 resultados
        offset: 1,// No cuenta el propio
        include : [
            {
                model : Grupos
            },
            {
                model: Usuarios,
                attributes: ['id', 'nombre', 'imagen']
            }
        ]
    });


    //2ª consulta. Despues de verificar que existe el Meeti
    const comentarios = await Comentarios.findAll({
        where: { meetiId : meeti.id },
        include: [
            {
                model: Usuarios,
                attributes: ['id', 'nombre', 'imagen']
            }
        ]
    });

    // Pasar el resultado a la vista
    res.render('mostrar-meeti', {
        nombrePagina: `${meeti.titulo}`,
        meeti,
        moment,
        comentarios,
        cercanos
    })
}


//Confirma o cancela sí el usuario asistira a un Meeti
exports.confirmarAsistencia = async(req,res) => {
    console.log(req.body);

    const { accion } = req.body;

    if (accion === 'confirmar') {
        // Agrega el Usuario
        Meeti.update(
            {'interesados' :  Sequelize.fn('array_append', Sequelize.col('interesados'), req.user.id  ) },
            {'where' : { 'slug' : req.params.slug }}
        );
        // Mensaje
        res.send('Has confirmado tu asistencia');
    }else {
        // Cancelar la asistencia de Usuario
        Meeti.update(
            {'interesados' :  Sequelize.fn('array_remove', Sequelize.col('interesados'), req.user.id  ) },
            {'where' : { 'slug' : req.params.slug }}
        );
        // Mensaje
        res.send('Has cancelado tu asistencia');
    }
}


// Mostrar Asistentes
exports.mostrarAsistentes = async (req,res) => {
    const meeti = await Meeti.findOne({
        where: { slug : req.params.slug },
        attributes : ['interesados']
    });
    // console.log(meeti);

    //Extraer interesados 
    const { interesados } = meeti;
    const asistentes = await Usuarios.findAll({
        attributes : ['nombre', 'imagen'],
        where : { id : interesados }
    })

    // console.log(asistentes);

    // Crear la vista y pasar datos
    res.render('asistentes-meeti', {
        nombrePagina : 'Asistentes a MEETI',
        asistentes
    })
    
    
}


// Muestra los Meetis agrupados por categoria
exports.mostrarCategoria = async (req,res,next) => {
    const categoria = await Categorias.findOne({ 
        attributes : ['id','nombre'],
        where : { slug : req.params.categoria }
    });

    const meetis = await Meeti.findAll({
        order : [
            ['fecha', 'ASC'],
            ['hora', 'ASC']
        ],
        include : [
            {
                model : Grupos,
                where : {categoriaId : categoria.id}
            },
            {
                model : Usuarios
            }
        ]
    });

    // Pasar a la vista
    res.render('categoria', {
        nombrePagina : `Categoria ${categoria.nombre}`,
        meetis,
        moment
    })
    
}
