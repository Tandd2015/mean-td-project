const Image = require('mongoose').model('Image');
const Http = require('@status/codes');

const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoURI = 'mongodb://localhost/tdpi';

let gfs;

mongoose.connection.once('connected', () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
});

const imageFilter = function(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
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
  index(_request, response) {
    Image.find({})
      .then(images => {
        if (!images) {
          return response.status(404).json(`No Images ${images} was found...`);
        }
        gfs.files.find({})
          .toArray((err, files) => {
            if (!files) {
              return response.status(404).json(err);
            }
            images.forEach((image, index, array) => {
              if (!image) {
                return response.status(404).json(`Image with the id: ${image._id} was not found...`);
              }
              files.forEach(file => {
                const imageObject = (image.file.toString() === file._id.toString()) ? {
                  _id: image._id,
                  title: image.title,
                  file: file,
                  category: image.category
                } : null;
                if (imageObject != null) {
                  array[index] = imageObject;
                }
              })
            })
            response.json(images);
          })
      })
      .catch(error => response.status(Http.InternalServerError).json(error))
  },
  create(request, response) {
    const upload = multer({ storage: storage, fileFilter: imageFilter }).single('file');
    upload(request, response, (error) => {
      if (request.fileValidationError) {
        return response.send(request.fileValidationError);
      } else if (!request.file) {
        return response.send('Please select an image to upload');
      } else if (error instanceof multer.MulterError) {
        return response.send(error);
      } else if (error) {
        return response.send(error);
      }
      console.log('request', request.file);
      Image.create({
        _id: new mongoose.Types.ObjectId(),
        title: request.body.title,
        file: request.file.id,
        category: request.body.category
      })
      .then(image => {
        const imageObject = image.toObject();
        response.json(imageObject);
      })
      .catch(err => {
        const errors = Object.keys(err.errors).map(key => err.errors[key].message);
        response.status(Http.UnprocessableEntity).json(errors);
      });
    });
  },
  show(request, response) {
    const { image_id: imageId } = request.params;
    Image.findOne({_id: imageId})
      .then(image => {
        if (!image) {
          return response.status(404).json(`Image with the id: ${imageId} was not found...`);
        }
        gfs.files.find({_id: image.file})
          .toArray((err, files) => {
            if (!files) {
              return response.status(404).json(err);
            }
            const imageObject = {
              _id: image._id,
              title: image.title,
              file: files[0],
              category: image.category
            }
            response.json(imageObject);
          })
      })
      .catch(error => {
        response.status(Http.NotFound).json(error);
      });

  },
  update(request, response) {
    const { image_id: imageId } = request.params;
    Image.findByIdAndUpdate(imageId, request.body, { new: true, runValidators: true })
    .then(image => {
        if (!image) {
          return response.status(404).json(`Image with the id: ${imageId} was not found...`);
        }
        gfs.files.find({_id: image.file})
          .toArray((err, files) => {
            if (!files) {
              return response.status(404).json(err);
            }
            const imageObject = {
              _id: image._id,
              title: request.body.title,
              file: files[0],
              category: request.body.category
            }
            response.json(imageObject);
          })
      })
      .catch(error => {
        const errors = Object.keys(error.errors).map(key => error.errors[key].message);
        response.status(Http.UnprocessableEntity).json(errors);
      })
  },
  destroy(request, response) {
    const { image_id: imageId } = request.params;
    Image.findByIdAndRemove(imageId)
      .then(image => {
        if (!image) {
          return response.status(404).json(`Image with the id: ${imageId} was not found...`);
        }
        gfs.files.deleteOne({_id: mongoose.Types.ObjectId(image.file)}, (err, file) => {
          if (err) {
            return response.status(Http.Conflict.json(err));
          }
          response.json(image);
        })
      })
      .catch(error => response.status(Http.Conflict.json(error)))
  },
  // retrieving image by id then retrieving image file by id
  // without populating full information of the files key and
  // does not combine the two models as a finish variable

  // show(request, response) {
  //   const { image_id: imageId } = request.params;
  //   Image.findOne({_id: imageId})
  //     .then(image => {
  //       if (!image) {
  //         throw new Error(`Image with the id: ${imageId} was not found...`);
  //       }
  //       gfs.files.find({_id: image.file})
  //         .toArray((err, files) => {
  //           console.log(files);
  //         })
  //       response.json(image);
  //     })
  //     .catch(error => {
  //       response.status(Http.NotFound).json(error);
  //     });
  // }
}
