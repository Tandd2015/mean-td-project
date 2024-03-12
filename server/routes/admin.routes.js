const { AuthController } = require('../controllers');
const router = require('express').Router();

module.exports = router
  .post('/login', AuthController.login)
  .post('/register', AuthController.register)
  .delete('/logout', AuthController.logout)
