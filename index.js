'use strict'
/* traer variable mongoose */
var mongoose = require('mongoose');
/* trae el servidor apps */
var app = require('./app');
/* puerto en el que trabaja la app */
var port = 3900;

/* desconectar metodos antiguos y forzar por nuevos metodos */
mongoose.set('useFindAndModify',false);
/* activacion de promesas en coneccion bd */
mongoose.Promise=global.Promise;

/* conexion con la BD mongoDB */
mongoose.connect('mongodb://localhost:27017/api_rest_blog',
{useNewUrlParser:true})
.then(()=>{
    console.log("la conexion a la base de datos apiRest es satisfactoria");
    /* crear servidor de escucha de peticiones http */
        app.listen(port,() => {
        console.log('servidor corriendo en http://localhost: '+port);
    });

});