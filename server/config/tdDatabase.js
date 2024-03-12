const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const mongoURI = 'mongodb://localhost/tdpi';

const modelsPath = path.join(__dirname, '../models');

mongoose.connect(mongoURI, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});



fs.readdirSync(modelsPath)
  .filter(file => file.endsWith('.js'))
  .forEach(file => require(path.join(modelsPath, file)));
