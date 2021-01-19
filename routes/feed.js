const express = require('express');

const { body } = require('express-validator');

const feedController = require('../controllers/feed');

// creacion del router feed para manejar todas las CRUDS de feed
const router = express.Router();

// GET /feed/posts 
router.get('/posts', feedController.getPosts);

// POST /feed/post - En el request es necesario colocar el body bajo JSON.stringify({}) y definir el header Content-Type: 'application/json'
router.post('/post',
   [
      body('title').trim().isLength({ min: 5 }),
      body('content').trim().isLength({ min: 5 })
   ],
   feedController.createPost);

router.get('/post/:postId', feedController.getPost);

module.exports = router;