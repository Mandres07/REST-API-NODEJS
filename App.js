const express = require('express');

const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

// este bordyparser sirve para recibir y parsear data en el formato: x-www-form-urlencoded, que se usa en los <form></form> de html
// app.use(bodyParser.urlencoded());

// este bordyparser sirve para recibir y parsear data en el formato: application/json que es el que se necesita para APIs
app.use(bodyParser.json());

app.use((req, res, next) => {
   // Permite hacer request de cualquier dominio, si queremos aceptar algunos dominios solo hacer la lista separado por coma en lugar de *
   res.setHeader('Access-Control-Allow-Origin', '*');
   // Permite definir bajo que metodos se permitiran los request de otros dominios
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
   // Permite que el cliente defina los headers enumerados (Content-Type y Authorization) en sus request
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   next();
});


app.use('/feed', feedRoutes);

// creacion de un servidor de node con express
app.listen(8080);