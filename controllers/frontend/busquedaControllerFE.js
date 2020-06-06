const Meeti = require('../../models/Meeti');
const Grupos = require('../../models/Grupos');
const Usuarios = require('../../models/Usuarios');


const Sequelize = require('sequelize');
const { Op } = require("sequelize");
const moment = require('moment');

exports.resultadosBusqueda = async(req,res,) => {
    // console.log(req.query);

    // leer datos de la URL
    const { categoria, titulo, ciudad, pais } = req.query;

    // Sí la categoriaesta vacia
    let query;
    if(categoria === '') {
        query = '';
    }else{
        query = `where : {
            categoriaId : { [Op.eq] : ${categoria}}
        }`
    }

    // Filtrar los Meetis por los terminos de la busqueda
    const meetis = await Meeti.findAll({
        where : {
            titulo: {[Op.iLike] : '%'+ titulo + '%'},
            ciudad: {[Op.iLike] : '%'+ ciudad + '%'},
            pais: {[Op.iLike] : '%'+ pais + '%'}
        },
        include : [
            {
                model : Grupos,
                query
            },
            {
                model: Usuarios,
                attributes: ['id', 'nombre', 'imagen']
            }
        ]
    });

    // Pasar los datos a la vista
    res.render('busqueda', {
        nombrePagina : 'Resultados Busqueda',
        meetis,
        moment
    })

}