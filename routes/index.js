const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const gruposController = require('../controllers/gruposController');
const meetiController = require('../controllers/meetiController');

const meetiControllerFE = require('../controllers/frontend/meetiControllerFE');
const usuariosControllerFE = require('../controllers/frontend/usuariosControllerFE');
const gruposControllerFE = require('../controllers/frontend/gruposControllerFE');
const comentariosControllerFE = require('../controllers/frontend/comentariosControllerFE');
const busquedaControllerFE = require('../controllers/frontend/busquedaControllerFE');


module.exports = function() {
/************************** AREA PUBLICA ******************************/
// No se requiere una cuenta para acceder a el 


    // Ruta para el home
    router.get('/', homeController.home);

    // Muestra un Meeti
    router.get('/meeti/:slug', 
        meetiControllerFE.mostrarMeeti
    );

    // Confirma asistencia a Meeti con boton en mostrar meeti
    router.post('/confirmar-asistencia/:slug',
        meetiControllerFE.confirmarAsistencia
    );

    // Agrega comentarios en el Meeti
    router.post('/meeti/:id', 
        comentariosControllerFE.agregarComentario
    
    );

    // Elimina comentarios del Meeti
    router.post('/eliminar-comentario',
    comentariosControllerFE.eliminarComentario
    );

    
    //Muestra Asistentes al Meeti
    router.get('/asistentes/:slug',
        meetiControllerFE.mostrarAsistentes
    );

    // Muestra perfiles en el Frontend
    router.get('/usuarios/:id',
        usuariosControllerFE.mostrarUsuario
    );

    // Muestra los grupos en el FrontEnd
    router.get('/grupos/:id', 
        gruposControllerFE.mostrarGrupo
    );

    // Muestra Meetis por categoria 
    router.get('/categoria/:categoria',
        meetiControllerFE.mostrarCategoria
    );

    // Añade la buusqueda
    router.get('/busqueda',
        busquedaControllerFE.resultadosBusqueda
    );

    // Rutas para Crear y Confirmar Cuentas
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearNuevaCuenta);
    router.get('/confirmar-cuenta/:correo', usuariosController.confirmarCuenta);

    // Ruta Iniciar Sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);
    
    
    // Cerrar Sesion 
    router.get('/cerrar-sesion', 
        authController.usuarioAutenticado,
        authController.cerrarSesion
    );

    



/************************** AREA PRIVADA*******************************/
// Se requiere una cuenta para acceder a el 





    // Panel de adminstracion
    router.get('/administracion', 
        authController.usuarioAutenticado,
        adminController.panelAdministracion ,
    );
    
    // Nuevos Grupos
    router.get('/nuevo-grupo',
        authController.usuarioAutenticado,
        gruposController.formNuevoGrupo
    );
    router.post('/nuevo-grupo',
        authController.usuarioAutenticado,
        gruposController.subirImagen,
        gruposController.crearGrupo
    );
    
    // Editar Grupos
    router.get('/editar-grupo/:grupoId', 
        authController.usuarioAutenticado,
        gruposController.formEditarGrupo
    );
    router.post('/editar-grupo/:grupoId', 
    authController.usuarioAutenticado,
    gruposController.editarGrupo
    );
    
    // Editar imagen del grupo
    router.get('/imagen-grupo/:grupoId', 
        authController.usuarioAutenticado,
        gruposController.formEditarImagen
    );
    router.post('/imagen-grupo/:grupoId', 
    authController.usuarioAutenticado,
    gruposController.subirImagen,
    gruposController.editarImagen
    );
    
    
    // Eliminar grupos(imagen tambien)
    router.get('/eliminar-grupo/:grupoId', 
        authController.usuarioAutenticado,
        gruposController.formEliminarGrupo
    );
    router.post('/eliminar-grupo/:grupoId', 
        authController.usuarioAutenticado,
        gruposController.eliminarGrupo
    );
    
    //Nuevos MEETI
    router.get('/nuevo-meeti', 
        authController.usuarioAutenticado,
        meetiController.formNuevoMeeti
    );
    router.post('/nuevo-meeti', 
        authController.usuarioAutenticado,
        meetiController.sanitizarMeeti,
        meetiController.crearMeeti
        );
        
        
    // Editar Meeti
    router.get('/editar-meeti/:id', 
        authController.usuarioAutenticado,
        meetiController.formEditarMeeti    
    );
    router.post('/editar-meeti/:id', 
        authController.usuarioAutenticado,
        meetiController.editarMeeti    
    );

    
    // Eliminar Meeti
    router.get('/eliminar-meeti/:id', 
        authController.usuarioAutenticado,
        meetiController.formEliminarMeeti    
    );
    router.post('/eliminar-meeti/:id', 
    authController.usuarioAutenticado,
    meetiController.eliminarMeeti    
    );
    
    // Editar informacion del Perfil de Usuario
    router.get('/editar-perfil', 
        authController.usuarioAutenticado,
        usuariosController.formEditarPerfil    
    );
    router.post('/editar-perfil', 
    authController.usuarioAutenticado,
    usuariosController.editarPerfil    
    );
    
    
    // Modifica el Password
    router.get('/cambiar-password', 
        authController.usuarioAutenticado,
        usuariosController.formCambiarPassword   
    );
    router.post('/cambiar-password', 
        authController.usuarioAutenticado,
        usuariosController.cambiarPassword   
    );
    
    
    // Muestra formulario para subir imagenes de perfil de usuario
    router.get('/imagen-perfil', 
        authController.usuarioAutenticado,
        usuariosController.formSubirImgenPerfil
    );
    router.post('/imagen-perfil', 
        authController.usuarioAutenticado,
        usuariosController.subirImagen,
        usuariosController.guardarImagenPerfil
    );

    return router;
}


