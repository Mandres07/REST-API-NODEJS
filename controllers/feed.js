const { validationResult } = require('express-validator');
const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
   Post.find()
      .then(posts => {
         // status(200) es success
         res.status(200).json({
            message: 'Posts fetched',
            posts: posts
         });
      })
      .catch(err => {
         if (!err.statusCode) {
            err.statusCode = 500;
         }
         next(err)
      });
};

exports.getPost = (req, res, next) => {
   const postId = req.params.postId;

   Post.findById(postId)
      .then(post => {
         if (!post) {
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error; // este throw si va a funcionar porque el proximo catch haace el next(err) necesario
         }
         // status(200) es success
         res.status(200).json({
            message: 'Post fetched.',
            post: post
         });
      })
      .catch(err => {
         if (!err.statusCode) {
            err.statusCode = 500;
         }
         next(err)
      });
};

exports.createPost = (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      // Handling errors con throw
      const error = new Error('Validation failed, entered data is incosrrect.');
      error.statusCode = 422;
      throw error;

      // handling errors manually
      // return res.status(422).json({
      //    message: 'Validation failed, entered data is incosrrect.',
      //    errors: errors.array()
      // });
   }
   // El request NO debe tener el header 'Content-Type': 'application/json'. Sino que deb eria ser enviado con un body FormData que le da formato de form automaticamente
   if (!req.file) {
      const error = new Error('No image provided.');
      error.statusCode = 422;
      throw error;
   }
   const { title, content } = req.body;

   const imageUrl = req.file.path.replace("\\", "/");
   // crea un documento bajo los criterios definidos en mongoose por la clase Post
   const post = new Post({
      // _id: new Date().toISOString(), // el _id mongoose lo crea automaticamente
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: { name: 'Mandres07' },
      // createdAt: new Date() // mongoose hace esto de fechas automatico
   });

   // guarda el documento en mongoDB
   post.save()
      .then(result => {
         console.log('Post created!');
         // status(201) es success se creo un registro
         res.status(201).json({
            message: 'Post created successfully',
            post: result
         });
      })
      .catch(err => {
         if (!err.statusCode) {
            err.statusCode = 500;
         }
         // como estamos en un bloque then/catch no funciona el throw, por lo ue el error hay q pasarlo al siguiente middleware con next(err)
         next(err);
      });
};