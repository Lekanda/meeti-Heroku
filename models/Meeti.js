const Sequelize = require('sequelize');
const db = require('../config/db');
// const { v4: uuidv4 } = require('uuid');
// const uuid = require('uuid/v4');
const slug = require('slug');
const shortid = require('shortid');


const Usuarios = require('./Usuarios');
const Grupos = require('./Grupos');


const Meeti = db.define(
    'meeti', {
        id : {
            type : Sequelize.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        titulo : {
            type: Sequelize.STRING,
            allowNull: false,
            validate : {
                notEmpty : {
                    msg: 'Hay que poner titulo para El Meeti'
                }
            }
        },
        slug: {
            type: Sequelize.STRING,

        },
        invitado : Sequelize.STRING,
        cupo : {
            type : Sequelize.INTEGER,
            defaultValue: 0
        },
        descripcion : {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Hay que poner una descripcion'
                }
            }
        },
        fecha : {
            type: Sequelize.DATEONLY,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Hay que poner una fecha de Meeti'
                }
            }
        },
        hora : {
            type: Sequelize.TIME,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Hay que poner una hora para el Meeti'
                }
            }
        },
        direccion : {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Hay que poner una direccion para el  Meeti'
                }
            }
        },
        ciudad : {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Hay que poner una ciudad para el Meeti'
                }
            }
        },
        estado : {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Hay que poner una Estado'
                }
            }
        },
        pais : {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Hay que poner un pais'
                }
            }
        },ubicacion : {
            type: Sequelize.GEOMETRY('POINT')
        },
        interesados: {
            type: Sequelize.ARRAY(Sequelize.INTEGER),
            defaultValue: []
        }

    }, {
        hooks: {
            async beforeCreate(meeti) {
                const url = slug(meeti.titulo).toLowerCase();
                meeti.slug = `${url}-${shortid.generate()}`;
            }
        }
    } );
Meeti.belongsTo(Usuarios);
Meeti.belongsTo(Grupos);



module.exports = Meeti;
