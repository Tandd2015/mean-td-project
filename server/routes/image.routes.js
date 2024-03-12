const { ImageController } = require('../controllers');
const router = require('express').Router();

module.exports = router
  .get('/', ImageController.index)
  .post('/', ImageController.create)
  .get('/:image_id', ImageController.show)
  .put('/:image_id', ImageController.update)
  .delete('/:image_id', ImageController.destroy)
