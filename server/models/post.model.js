const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  content: {
    type: String,
    trim: true,
    minlength: [1, 'Google post content is required to be longer than 1 character.'],
    default: ""
  },
  contentImages: [{
    type: String,
    minlength: [1, 'Google post content image must be at least 1 character.'],
    trim: true
  }],
  writtenBy: {
    type: String,
    trim: true,
    required: [true, 'Google post writtenBy is a required field.'],
    minlength: [1, 'Google post writtenBy is required to be longer than 1 character.'],
    maxlength: [360, 'Google post writtenBy must not be longer than 360 characters.']
  },
  byImage: {
    type: String,
    required: [true, 'Google post user image is a required field must not be blank.'],
    minlength: [1, 'Google post user image must be at least 1 character.'],
    trim: true
  },
  byDate: {
    type: String,
    required: [true, 'Google post user created date is a required field must not be blank.'],
    minlength: [1, 'Google post user created date must be at least 1 character.'],
    maxlength: [360, 'Google post user created date must not be longer than 360 characters.'],
    trim: true
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);
