const Comentarios = require('../../models/Comentarios');
const Meeti = require('../../models/Meeti');

exports.agregarComentario = async ( req,res,next)=> {
    // console.log(req.body);


    // Obtener el comentario
    const { comentario } = req.body;

    // Crear comentarioen la DB
    await Comentarios.create({
        mensaje: comentario,
        usuarioId: req.user.id,
        meetiId: req.params.id  
    });

    // Redireccionar a la vista
    res.redirect('back');
    next();

    
}


// Elimina un comentario de la DB
exports.eliminarComentario = async(req,res,next) => {
    // console.log(req.body);

    // Tomar el ID del comentario
    const { comentarioId } = req.body;

    // Consultar el comentario
    const comentario = await Comentarios.findOne({ where: { id : comentarioId }});
    
    
    // Verificar sí existe el comentario
    if(!comentario) {
        res.status(404).send('Accion no valida');
        return next();
    }


    // Consultar el Meeti del comentario
    const meeti = await Meeti.findOne({ where : { id : comentario.meetiId } });



    //Verificar que quien lo borra sea el creador
    if(comentario.usuarioId === req.user.id || meeti.usuarioId === req.user.id) {
        await Comentarios.destroy({ where : {
            id : comentario.id
        }});
        res.status(200).send('Eliminado Correctamente....');
        return next();
    } else {
        res.status(403).send('Accion no valida');
        return next();
    }
}