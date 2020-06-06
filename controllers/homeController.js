const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos');
const Meeti = require('../models/Meeti');
const Usuarios = require('../models/Usuarios');
const moment = require('moment');
const Sequelize = require('Sequelize');
const Op = Sequelize.Op;


exports.home = async (req,res) => {

    //Promise para consultas de buscador (Busca un grupo en tu ciudad ) en el home
    const consultas = [];
    consultas.push( Categorias.findAll({}) );
    consultas.push( Meeti.findAll({
        attributes : ['slug', 'titulo', 'fecha', 'hora'],// Limita que datos del objeto se van a comprobar
        where : {
            fecha : { [Op.gte] : moment(new Date()).format("YYYY-MM-DD") }
        },
        limit : 3, // Limita a 3 Resultados
        order : [
            ['fecha', 'ASC']
        ], 
        include : [
            {
                model : Grupos,
                attributes : ['imagen']
            },
            {
                model : Usuarios,
                attributes : ['nombre', 'imagen']
            }
        ]
    }) 
    );



    //Destructuring para extraer y pasar a la vista
    const [ categorias, meetis ] = await Promise.all(consultas);


    // console.log(meetis);
    // console.log(meetis.length);
    

    // Redireccion
    res.render('home', {
        nombrePagina:'Inicio',
        categorias,
        meetis,
        moment
    });
};


