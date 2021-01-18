exports.getPosts = (req, res, next) => {
   // status(200) es success
   res.status(200).json({
      posts: [{ title: 'First Posts', content: 'This is the first post!' }]
   });
};

exports.createPost = (req, res, next) => {
   const { title, content } = req.body;
   // create post
   // status(201) es success se creo un registro
   res.status(201).json({
      message: 'Post created successfully',
      post: { id: new Date().toISOString(), title: title, content: content }
   });
};