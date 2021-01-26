const expect = require('chai').expect;
const sinon = require('sinon');
const User = require('../models/user');
const AuthController = require('../controllers/auth');
const mongoose = require('mongoose');

describe('Auth Controller', () => {

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

   it('should throw an error with cdoe 500 if accessing the database fails', (done) => {
      sinon.stub(User, 'findOne');
      User.findOne.throws();

      const req = {
         body: {
            email: 'test@test.com',
            password: '12345'
         }
      };

      AuthController.login(req, {}, () => { }).then(result => {
         expect(result).to.be.an('error');
         expect(result).to.have.property('statusCode', 500);
         done();
      });

      User.findOne.restore();
   });

   it('should send a response with a valid user status for an existing user', (done) => {
      const req = { userId: '600d9074ffdd914b40745b2a' };
      const res = {
         statusCode: 500,
         userStatus: null,
         status: function (code) {
            this.statusCode = code;
            return this;
         },
         json: function (data) {
            this.userStatus = data.status;
         }
      };
      AuthController.getUserStatus(req, res, () => { }).then(() => {
         expect(res.statusCode).to.be.equal(200);
         expect(res.userStatus).to.be.equal('I am new!');
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


