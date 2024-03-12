const mongoose = require('mongoose');
const { Schema } = mongoose;

const VideoSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Video title is a required field must not be blank.'],
    minlength: [1, 'Video title must be at least 1 character.'],
    maxlength: [360, 'Video title must not be longer than 360 characters.'],
    trim: true
  },
  file: {
    type: Schema.Types.ObjectId,
    ref: 'uploads.file',
  },
  category: {
    type: String,
    required: [true, 'Video category is a required field must not be blank.'],
    minlength: [1, 'Video category must be at least 1 character.'],
    maxlength: [360, 'Video category must not be longer than 360 characters.'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Video', VideoSchema);
