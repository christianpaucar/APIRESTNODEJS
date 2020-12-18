'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var ArticleSchema = Schema({
    titulo:String,
    contenido:String,
    date:{type:Date,default:Date.now},
    image:String
});

module.exports=mongoose.model('Article',ArticleSchema);
//articles --> guardar documentos de este tipo y con la estructura de coleccion
