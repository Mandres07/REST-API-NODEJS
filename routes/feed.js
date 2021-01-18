const express = require('express');

const feedController = require('../controllers/feed');

// creacion del router feed para manejar todas las CRUDS de feed
const router = express.Router();

// GET /feed/posts 
router.get('/posts', feedController.getPosts);

// POST /feed/post - En el request es necesario colocar el body bajo JSON.stringify({}) y definir el header Content-Type: 'application/json'
router.post('/post', feedController.createPost);

module.exports = router;