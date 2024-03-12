const { SectionController } = require('../controllers');
const router = require('express').Router();

module.exports = router
  .get('/all', SectionController.index)
  .post('/', SectionController.create)
  .get('/single/:section_id', SectionController.showTwo)
  .get('/:section_id', SectionController.show)
  .put('/:section_id', SectionController.update)
  .delete('/:section_id', SectionController.destroy)
