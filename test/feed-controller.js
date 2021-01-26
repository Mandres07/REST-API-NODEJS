const expect = require('chai').expect;
const sinon = require('sinon');
const User = require('../models/user');
const Post = require('../models/post');
const FeedController = require('../controllers/feed');
const mongoose = require('mongoose');

describe('Feed Controller', () => {

   // Before permite definir funciones que se ejecutan antes de todo el conjunto de tests como conexiones a bd y creacion de usuarios dummy
   // tambien existe beforEach que se ejecuta antes de cada it()
   before(function (done) {
      mongoose.connect('mongodb+srv://Mandres:Mandres.07.mdb@cluster0.qnd1j.mongodb.net/test-messages?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
         .then(result => {
            const user = new User({
               email: 'test@test.com',
               password: '12345',
               name: 'Mandres',
               posts: [],
               _id: '600d9074ffdd914b40745b2a'
            });
            return user.save();
         })
         .then(() => {
            done();
         })
   })

   it('should add a created post to the posts array of the creator user', (done) => {
      const req = {
         body: {
            title: 'test post',
            content: 'test content'
         },
         file: {
            path: 'abc'
         },
         userId: '600d9074ffdd914b40745b2a'
      };

      const res = {
         status: function () {
            return this;
         },
         json: function () { }
      };

      FeedController.createPost(req, res, () => { }).then(user => {
         expect(user).to.have.property('posts');
         expect(user.posts).to.have.length(1);
         done();
      });
   });

   // after permite definir funciones que se ejecutan despues de todo el conjunto de tests como desconexiones a bd y borrado de usuarios
   // tambien existe afterEach que se ejecuta despues de cada it()
   after(function (done) {
      User.deleteMany({})
         .then(() => {
            return mongoose.disconnect();
         })
         .then(() => {
            done();
         })
   });

});


