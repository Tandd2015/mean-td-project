const { VideoController } = require('../controllers');
const router = require('express').Router();

module.exports = router
  .get('/', VideoController.index)
  .post('/', VideoController.create)
  .get('/:video_id', VideoController.show)
  .put('/:video_id', VideoController.update)
  .delete('/:video_id', VideoController.destroy)
