const { Http } = require('@status/codes');
const Admin = require('mongoose').model('Admin');

const mongoose = require('mongoose');

const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoURI = 'mongodb://localhost/tdpi';

const imageFilter = function(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only image files are allowed for uploads! ';
    return cb(new Error('Only image files are allowed for uploads! ', false));
  }
  cb(null, true);
};

const storage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

module.exports = {
  login(request, response) {
    // new lines of code previous email and password variables were returning
    // undefined in the post man api
    const email = request.body.email;
    const password = request.body.password;
    console.log('Logging in admin. ', email, password);
    Admin.findOne({ email })
      .then(admin => {
        return Admin.validatePassword(password, admin.password)
          .then(isValid => {
            if (!isValid) {
              throw new Error();
            }
            completeLogin(request, response, admin);
          });
      })
      .catch(() => {
        response.status(Http.Unauthorized).json('Email address and password combination does not exist within the database. ');
      });
  },
  register(request, response) {
    console.log('Registering and logging in admin user.');
    const upload = multer({ storage: storage, fileFilter: imageFilter }).single('profilePicture');
    upload(request, response, (error) => {
      if (request.fileValidationError) {
        return response.send(request.fileValidationError);
      } else if (!request.file) {
        return response.send('Please select a picture of allowed format. ');
      } else if (error instanceof multer.MulterError) {
        return response.send(error);
      } else if (error) {
        return response.send(error);
      }
      Admin.create({
        _id: new mongoose.Types.ObjectId(),
        email: request.body.email,
        password: request.body.password,
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        phoneNumber: request.body.phoneNumber,
        profilePicture: request.file.id
        // profilePicture: request.files['profilePicture'][0].id
      })
      .then(admin => {
        completeLogin(request, response, admin);
      })
      .catch(error => {
        const errors = Object.keys(error.errors).map(key => error.errors[key].message);
        response.status(Http.UnprocessableEntity).json(errors);
      });
    });
  },
  logout(request, response) {
    console.log('Logging out admin user. ');
    request.session.destroy();
    response.clearCookie('adminID');
    response.clearCookie('expiration');
    response.json(true);
  },
};

function completeLogin(request, response, admin) {
  console.log('Completing login of admin user. ');
  const adminObject = admin.toObject();
  delete admin.password;
  request.session.admin = adminObject;
  response.cookie('adminID', adminObject._id);
  response.cookie('expiration', Date.now() + 86400 * 1000);
  response.json(adminObject);
}
