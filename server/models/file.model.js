const mongoose = require('mongoose');
const { Schema } = mongoose;

const FileSchema = new Schema({
  length: {
    type: Number,
    trim: true,
    required: [true, 'File length is a required field']
  },
  chunkSize: {
    type: Number,
    trim: true,
    required: [true, 'File size is a required field']
  },
  uploadDate: {
    type: Date,
    trim: true,
    required: [true, 'File uploadDate is a required field']
  },
  filename: {
    type: String,
    trim: true,
    required: [true, 'File filename is a required field']
  },
  md5: {
    type: String,
    trim: true,
    required: [true, 'File md5 is a required field']
  },
  contentType: {
    type: String,
    trim: true,
    required: [true, 'File contentType is a required field']
  }
});

module.exports = mongoose.model('FileModel', FileSchema);
