const { PostController } = require('../controllers');
const router = require('express').Router();

module.exports = router
  .get('/all', PostController.index)
  .get('/site-only', PostController.indexAlt)
  .post('/', PostController.create)
  .get('/single/:post_id', PostController.showTwo)
  .get('/:post_id/:mainImage_id', PostController.show)
  .put('/:post_id', PostController.update)
  .delete('/:post_id', PostController.destroy)
