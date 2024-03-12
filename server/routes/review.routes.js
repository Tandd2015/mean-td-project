const { ReviewController } = require('../controllers');
const router = require('express').Router();

module.exports = router
  .get('/all', ReviewController.index)
  .get('/site-only', ReviewController.indexAlt)
  .post('/', ReviewController.create)
  .get('/:review_id', ReviewController.show)
  .get('/single/:review_id', ReviewController.showTwo)
  .put('/:review_id', ReviewController.update)
  .delete('/:review_id', ReviewController.destroy)
