'use strict'

/* cargar modulos de node para  crear servidor de requeqss*/
var express = require('express');
var bodyParser = require('body-parser');


/* ejecutar express (http) */
var app=express();

/* cargar ficheros rutas */

var article_routes=require('./routes/article');

/*  middleawares*/
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
/* CORS PARA PODER CONSUMIR SERVICIOS DE LA API */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

/* añadir prefijos o rutas */
app.use('/',article_routes);

/* ruta o metodo de prueba para la escucha del localhost:3900 (APIREST)*/
/* app.get('/probando',(req,res)=>{
    console.log("holamundo");
    var ja = req.body.ja;
    return res.status(200).send({
        curso:'master en Frameworks Js',
        autor:'Fernando Paucar',
        url:'fernando.com',
        ja
    });
}); */

/* exportar modulos (dichero manual) */
module.exports=app;