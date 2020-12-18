'use strict'

var validator=require('validator');

var fs=require('fs');
var path=require('path');

var  Article=require('../models/article');

const { Mongoose } = require("mongoose");
const { exists } = require('../models/article');
const { argv0 } = require('process');

var controller={

   datosCurso:(req,res)=>{
        //console.log("holamundo");
        var ja = req.body.ja;
        return res.status(200).send({
            curso:'master en Frameworks Js',
            autor:'Fernando Paucar',
            url:'fernando.com',
            ja
        });
    },

    test:(req,res)=>{
        return res.status(200).send({
            message:'accion de controlador de articulos'
        });
    },

    save:(req,res)=>{
        var params=req.body;
        //validar datos(validator)
        try{
            var validate_titulo = !validator.isEmpty(params.titulo);
            var validate_contenido = !validator.isEmpty(params.contenido);

        }catch(err){
            return res.status(404).send({
                status:'error',
                message:'faltan datos por enviar del articulo'
            });
        }

        if(validate_titulo && validate_contenido){
            //crear el objeto a guardar
            var article=new Article();

            //asignar valores
            article.titulo=params.titulo;
            article.contenido=params.contenido;
            article.image=null;

            //guardar articulo
            article.save((err,articleStored)=>{
                if(err || !articleStored){
                    return res.status(404).send({
                        status:'error',
                        message:'el articulo no se a guardado!!'
                    });
                 
                }

                 //devolver una respuesta

                return res.status(200).send({
                    status:'success',
                    article:articleStored
                });
            });
           
        }else{
            return res.status(404).send({
                status:'error',
                message:'los datos no son validos'
            });
        }
        
    },

    getArticles:(req,res)=>{
        
        var last=req.params.last;
        
        var query=Article.find({});

        if (last || last != undefined) {
           query.limit(5); 
        }

        /* find */
        query.sort('-_id').exec((err,articles)=>{
            
            if (err) {
                return res.status(500).send({
                    status:'error',
                    message:'error al devolver articulos'
                });
                
            }

            if (!articles) {
                return res.status(404).send({
                    status:'error',
                    message:'no hay articulos'
            });
                
            }

            return res.status(200).send({
                status:'success',
                articles
            }); 
        });    

    },
    getArticle:(req,res)=>{
        /* recoger la id del url */
        var articleid=req.params.id;

        /* comprobar que existe */
        if (!articleid || articleid==null) {
            return res.status(404).send({
                status:"error",
                message:"no existe el articulo"
            });
        }
        /* buscar articulo */
        Article.findById(articleid,(err,article)=>{
            if (err) {
                return res.status(500).send({
                    status:"error",
                    message:"error al devolver los datos"
                });
                
            }
            if (!article) {
                return res.status(404).send({
                    status:"error",
                    message:"no existe el articulo"
                });
                
            }
              /* devolver en json */
        return res.status(200).send({
            status:"success",
            article
        });
        });
      
    },

    update:(req,res)=>{


        /* recopger id por ul */
        var articleid=req.params.id;


        /* recoger los datos que llegan por put */
        var params=req.body;
        /* validar */
        try {
            var validate_titulo = !validator.isEmpty(params.titulo);
            var validate_contenido = !validator.isEmpty(params.contenido);
            
        } catch (err) {
            return res.status(404).send({
                status:"error",
                message:"faltan datos por enviar"
            });
            
        } 
        if (validate_titulo && validate_contenido) {
            /* find and update */
            
            Article.findOneAndUpdate({ _id: articleid},params,{new:true},(err,articleUpdated)=>{
                if (err) {
                    return res.status(500).send({
                        status:"error",
                        message:"fallo al actualizar"
                    });
                }
                if (!articleUpdated) {
                    return res.status(500).send({
                        status:"error",
                        message:"no existe el articulo"
                    });
                }
                return res.status(200).send({
                    status:"success",
                    article: articleUpdated
                });
            });
        } else {
            /* devolver respuesta */
            return res.status(500).send({
                status:"error",
                message:"la validadion no es correcta"
            });
            
        }      
               
    },

    delete:(req,res)=>{

        //recoger id de ur
        var articleid=req.params.id;
        // find and delete
        Article.findOneAndDelete({ _id: articleid},(err,articleRemoved)=>{
          if(err){
              return res.status(500).send({
                  status:"error",
                  message:"error al borrar"
              });
            }
            if(!articleRemoved){
                return res.status(404).send({
                    status:"error",
                    message:"no se a borrado el articulo posiblemente no exista"
                });
            }
            return res.status(200).send({
                status:"success",
                article:articleRemoved
            });

           
        });
       
    },

    upload:(req,res)=>{
        /* configurar el modulo connect multiparty router/aricle.js */
        
        /* recoger el fichero de petion */
        var file_name='imagen no fue subida..';
        if (!req.files) {
            return res.status(404).send({
                status:"error",
                message:file_name
            });
            
        }

        /*  conseguir nombre y la extension del archivo*/
        var file_path=req.files.file0.path;
        var file_split=file_path.split('\\');
        //ATENCION PARA LINUX O MAC USAMOS servidor real
        //var file_split=file_path.split('/');

        /* Nombre del archivo */
        var file_name=file_split[2];

        //extension del fichero
        var extension_split=file_name.split('\.');
        var file_ext=extension_split[1];

        
        /* comprobar la extension , solo imagenes , si no es validad borrar el fichero */
        if (file_ext!='png' && file_ext!='jpg' && file_ext!='jpeg' && file_ext!='git') {
            /* borrar archivo */
            fs.unlink(file_path,(err)=>{
                return res.status(200).send({
                    status:"error",
                    message:"la extension de la imagen no es valida"
                });
            });
        }else{
            /*  si todo es  valido */
           var articleid=req.params.id;
            /* buscar articulo , asignar nombre de imagen , actualizarlo */
            Article.findOneAndUpdate({_id:articleid},{image:file_name},{new:true},(err,articleUpdated)=>{

                if (err || !articleUpdated) {
                    return res.status(404).send({
                        status:"error",
                        message:"error al guardar imagen del archivo"
                    });
                }

                return res.status(200).send({
                    status:"success",
                    article:articleUpdated
                });
            });
            
        }
        
      
    },//end upload imagen

    getimage:(req,res)=>{
        var file=req.params.image;
        var path_file='./upload/articles/'+file;

        fs.exists(path_file,(exists)=>{
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(200).send({
                    status:"error",
                    message: "fallo la imagen no existe"
                });
            }
        });

        
    },

    search:(req,res)=>{
        /* capturar el string a buscar */
        var searchString=req.params.search;
        /* Find or condiciones o para title o contenido */      
        
        Article.find({"$or":[
            {"titulo":{"$regex":searchString,"$options":"i"}},
            {"contenido":{"$regex":searchString,"$options":"i"}},
        ]})
        //orden desendente por fecha
        .sort([['date','descending']])
        .exec((err,articles)=>{

           if (err) {
            return res.status(500).send({
                status:"error",
                message:"error en la peticion"
            });
           }
           if (!articles || articles.length<=0) {
            return res.status(500).send({
                status:"error",
                message:"no se encuentra un articulo que haga referencia a tu busqueda"
            });
           }

          
            return res.status(200).send({
                status:"success",
                articles
            });
           
           
            
        });

       
    }



};//end

module.exports=controller;
