const Section = require('mongoose').model('Section');

const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoURI = 'mongodb://localhost/tdpi';
const { Http } = require('@status/codes');

const fileFilter = function(req, file, cb) {
  if (!file.originalname.match(/\.(mp4|MP4|mov|MOV|wmv|WMV|flv|FLV|avi|AVI|avchd|AVCHD|webm|WEBM|mkv|MKV|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only video or image files are allowed!';
    return cb(new Error('Only video files are allowed!'), false);
  }
  cb(null, true);
};
let gfs;
let gfsS;

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

let connect = mongoose.createConnection(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.once('connected', () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
});

connect.once('open', () => {
  gfsS = new mongoose.mongo.GridFSBucket(connect.db, {bucketName: 'uploads'});
});

module.exports = {
  index(_request, response) {
    Section.find({})
      .then(sections => {
        if (!sections) {
          return response.status(404).json(`No Reviews was found... ${sections}`);
        }
        gfs.files.find({})
          .toArray((err, files) => {
            if (!files) {
              return response.status(404).json(err);
            }
            sections.forEach((section, index, array) => {
              if (!section) {
                return response.status(404).json(`No Review with the id: ${section._id} was found...`);
              }
              files.forEach(sectionImage => {
                const sectionObject = (section.sectionImage.toString() === sectionImage._id.toString()) ? {
                  _id: section._id,
                  title: section.title,
                  content: section.content,
                  sectionImage: sectionImage,
                  sectionImagePath: section.sectionImagePath,
                  sectionImageAttributionCredit: section.sectionImageAttributionCredit,
                  sectionImageAttributionLink: section.sectionImageAttributionLink,
                  createdAt: section.createdAt,
                  updatedAt: section.updatedAt,
                } : null;
                if (sectionObject != null) {
                  array[index] = sectionObject;
                }
              });
            });
            response.json(sections);
          });
      })
      .catch(error => response.status(Http.InternalServerError).json(error));
  },
  create(request, response) {
    const upload = multer({ storage: storage, fileFilter: fileFilter }).single('sectionImage');
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
      let newId = new mongoose.Types.ObjectId();
      let pathFile = `http://localhost:5000/api/home/sections/${newId}`;
      Section.create({
        _id: newId,
        title: request.body.title,
        content: request.body.content,
        sectionImage: request.file.id,
        sectionImagePath: pathFile,
        sectionImageAttributionCredit: request.body.sectionImageAttributionCredit,
        sectionImageAttributionLink: request.body.sectionImageAttributionLink,
      })
      .then(section => {
        const sectionObject = section.toObject();
        response.json(sectionObject);
      })
      .catch(err => {
        const errors = Object.keys(err.errors).map(key => err.errors[key].message);
        response.status(Http.UnprocessableEntity).json(errors);
      });
    });
  },
  show(request, response) {
    const { section_id: sectionId } = request.params;
    Section.findOne({_id: sectionId})
      .then(section => {
        if(!section) {
          return response.status(404).json(`App Review with id ${sectionId} not found!`);
        }
        gfsS.find({_id: mongoose.Types.ObjectId(section.sectionImage)})
          .toArray((err, files) => {
            if (!files) {
              return response.status(404).json(err);
            }
            return gfsS.openDownloadStreamByName(files[0].filename).pipe(response);
          });
      })
      .catch(error => {
        response.status(Http.NotFound).json(error);
      });
  },
  showTwo(request, response) {
    const { section_id: sectionId } = request.params;
    Section.findOne({_id: sectionId})
      .then(section => {
        if(!section) {
          return response.status(404).json(`App Review with id ${sectionId} not found!`);
        }
        gfs.files.find({_id: section.sectionImage})
          .toArray((err, files) => {
            if (!files) {
              return response.status(404).json(err);
            }
            const sectionObject = {
              _id: section._id,
              title: section.title,
              content: section.content,
              sectionImage: files[0],
              sectionImagePath: section.sectionImagePath,
              sectionImageAttributionCredit: section.sectionImageAttributionCredit,
              sectionImageAttributionLink: section.sectionImageAttributionLink,
              createdAt: section.createdAt,
              updatedAt: section.updatedAt,
            };
            response.json(sectionObject);
          });
      })
      .catch(error => {
        response.status(Http.NotFound).json(error);
      });
  },
  update(request, response) {
    const { section_id: sectionId } = request.params;
    const upload = multer({ storage: storage, fileFilter: fileFilter }).single('sectionImage');
    upload(request, response, (error) => {

      let newObject = JSON.parse(request.body.newObject);
      delete request.body.newObject;

      if (request.fileValidationError) {
        return response.send(request.fileValidationError);
      } else if (!request.file) {
        return response.send('Please select an image to upload');
      } else if (error instanceof multer.MulterError) {
        return response.send(error);
      } else if (error) {
        return response.send(error);
      }

      if (request.file) {
        request.body.sectionImage = mongoose.Types.ObjectId(request.file.id);
      } else {
        request.body.sectionImage = newObject.sectionImage;
        newObject.sectionImage = null;
      }

      Section.findByIdAndUpdate(sectionId, request.body, { new: true, runValidators: true })
        .then(section => {
          if (!section) {
            return response.status(404).json(`Review with the id: ${sectionId} was not found...`);
          }

          if (newObject.sectionImage !== null) {
            gfs.files.deleteOne({_id: mongoose.Types.ObjectId(newObject.sectionImage)});
            newObject.sectionImage = null;
          }

          gfs.files.find({_id: section.sectionImage})
            .toArray((err, files) => {
              if (!files) {
                return response.status(404).json(err);
              }
              console.log(request.file, request.body, section, newObject);
              const sectionObject = {
                _id: section._id,
                title: section.title,
                content: section.content,
                sectionImage: files[0],
                sectionImagePath: section.sectionImagePath,
                sectionImageAttributionCredit: section.sectionImageAttributionCredit,
                sectionImageAttributionLink: section.sectionImageAttributionLink,
                createdAt: section.createdAt,
                updatedAt: section.updatedAt,
              };
              response.json(sectionObject);
            });
        })
        .catch(error => {
          const errors = Object.keys(error.errors).map(key => error.errors[key].message);
          response.status(Http.UnprocessableEntity).json(errors);
        });
    });
  },
  destroy(request, response) {
    const { section_id: sectionId } = request.params;
    Section.findByIdAndRemove(sectionId)
      .then(section => {
        if (!section) {
          return response.status(404).json(`Review with the id: ${sectionId} was not found...`);
        }
        gfs.files.deleteOne({_id: mongoose.Types.ObjectId(section.sectionImage)}, (err, file) => {
          if (err) {
            return response.status(Http.Conflict.json(err));
          }
          response.json(section);
        });
      })
      .catch(error => response.status(Http.Conflict).json(error));
  }
}
