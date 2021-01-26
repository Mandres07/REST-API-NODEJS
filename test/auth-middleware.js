const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/is-auth');
const sinon = require('sinon');

describe('Auth Middleware', () => {
   it('should throw an error if no authorization header is present', () => {
      const req = {
         get: function (headerName) {
            return null;
         }
      };
      expect(authMiddleware.bind(this, req, {}, () => { })).to.throw('Not authenticated'); // prueba que el middleware al ser ejecutado con el req definido arroje un error con mensaje Not authenticated
   });

   it('should throw an error if the Authorization header is only one string', () => {
      const req = {
         get: function (headerName) {
            return 'xyz';
         }
      };
      expect(authMiddleware.bind(this, req, {}, () => { })).to.throw(); // prueba que el middleware al ser ejecutado con el req definido arroje un error
   });

   it('should yield a userId after decoding the token', () => {
      const req = {
         get: function (headerName) {
            return 'Bearer xyz';
         }
      };
      // Sinon reemplaza funciones de objetos existentes para esta prueba y despues lo deja normal con su funcion real, en este caso vamos a reemplazar la funcion verify
      sinon.stub(jwt, 'verify');

      // Aqui definimos que va a retornar la funcion verify
      jwt.verify.returns({ userId: 'abc' });

      authMiddleware(req, {}, () => { });
      expect(req).to.have.property('userId'); // prueba que el req tenga la propiedad userId
      expect(req).to.have.property('userId', 'abc'); // prueba que el req tenga una propiedad userId que a la vez tenga el valor 'abc'
      expect(jwt.verify.called).to.be.true; // prueba que la funcion verify fue llamada

      // Restaura la funcion como era originalmente
      jwt.verify.restore();
   });

   it('should throw an error if the token cannot be verified', () => {
      const req = {
         get: function (headerName) {
            return 'Bearer xyz';
         }
      };
      expect(authMiddleware.bind(this, req, {}, () => { })).to.throw(); // prueba que el middleware al ser ejecutado con el req definido arroje un error
   });

});

