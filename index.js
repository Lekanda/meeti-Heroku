const express = require('express');
const routes = require('./routes');
const path = require ('path');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
// const expressValidator = require('express-validator');(Version Antigua)
const passport = require('./config/passport');



// Configuracion para la DB
const db = require('./config/db');
require('./models/Usuarios');
require('./models/Categorias');
require('./models/Grupos');
require('./models/Meeti');
require('./models/Comentarios');
db.sync()
    .then(() => console.log('Conectado a la Base de Datos de Meeti'))
    .catch(error => console.log(error));


 // Path para variables.env   
require('dotenv').config({path: 'variables.env'});


// Instanciar Express en app
const app = express();


// BodyParser para leer formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Express validator (validación con bastantes funciones)(Version Antigua)
// app.use(expressValidator());


/****Habilitar EJS como Template Engine*******/
app.use(expressLayouts);
app.set('view engine', 'ejs');
// Ubicacion Vistas
app.set('views', path.join(__dirname, './views'));


/***********Archivos Estaticos**************/
app.use(express.static('public'));


/***********Habilitar Cookie-Parser**************/
app.use(cookieParser());
/***********Habilitar Express-Session************/
app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized : false
}));

/************INICIALIZAR PASSPORT*********/
app.use(passport.initialize());
app.use(passport.session());

/***********Connect-Flash**************/
app.use(flash());


/****Mi Middleware(usuario logeado, flash mss, fecha actual)****/
app.use((req,res,next) => {
    res.locals.usuario = { ...req.user } || null;
    res.locals.mensajes = req.flash();
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
});


/*************Rutas*****************/
app.use('/', routes());

// Leer el Host y el Puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 7000;

/*********Puerto de escucha************/
app.listen(port, host,  () => {
    console.log('Servidor Express en Marcha');
});
