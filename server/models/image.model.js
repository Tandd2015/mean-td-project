const mongoose = require('mongoose');
const { Schema } = mongoose;

const ImageSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Image title is a required field must not be blank.'],
    minlength: [1, 'Image title must be at least 1 character.'],
    maxlength: [360, 'Image title must not be longer than 360 characters.'],
    trim: true
  },
  file: {
    type: Schema.Types.ObjectId,
    ref: 'uploads.file'
  },
  category: {
    type: String,
    required: [true, 'Image category is a required field must not be blank.'],
    minlength: [1, 'Image category must be at least 1 character.'],
    maxlength: [360, 'Image category must not be longer than 360 characters.'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Image', ImageSchema);
