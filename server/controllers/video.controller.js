const Video = require('mongoose').model('Video');
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

const videoFilter = function(req, file, cb) {
  if (!file.originalname.match(/\.(mp4|MP4|mov|MOV|wmv|WMV|flv|FLV|avi|AVI|avchd|AVCHD|webm|WEBM|mkv|MKV)$/)) {
    req.fileValidationError = 'Only video files are allowed!';
    return cb(new Error('Only video files are allowed!'), false);
  }
  cb(null, true);
}

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
    Video.find({})
      .then(videos => {
        if (!videos) {
          return response.status(404).json(`No Videos ${videos} was found...`);
        }
        gfs.files.find({})
          .toArray((err, files) => {
            if (!files) {
              return response.status(404).json(err);
            }
            console.log(files);
            videos.forEach((video, index, array) => {
              if (!video) {
                return response.status(404).json(`Video with the id: ${video._id} was not found...`);
              }
              files.forEach(file => {
                const videoObject = (video.file.toString() === file._id.toString()) ? {
                  _id: video._id,
                  title: video.title,
                  file: file,
                  category: video.category
                } : null;
                if (videoObject != null) {
                  array[index] = videoObject;
                }
                })
            })
            response.json(videos);
          })
      })
      .catch(error => response.status(Http.InternalServerError).json(error));
  },
  create(request, response) {
    const upload = multer({ storage: storage, fileFilter: videoFilter }).single('file');
    upload(request, response, (error) => {
      if (request.fileValidationError) {
        return response.send(request.fileValidationError);
      } else if (!request.file) {
        return response.send('Please select an video to upload');
      } else if (error instanceof multer.MulterError) {
        return response.send(error);
      } else if (error) {
        return response.send(error);
      }
      console.log(`Creating a Upload File first ${request}`);
      Video.create({
        _id: new mongoose.Types.ObjectId(),
        title: request.body.title,
        file: request.file.id,
        category: request.body.category
      })
      .then(video => {
        const videoObject = video.toObject();
        response.json(videoObject);
      })
      .catch(err => {
        const errors = Object.keys(err.errors).map(key => err.errors[key].message);
        response.status(Http.UnprocessableEntity).json(errors);
      })
    })
  },
  show(request, response) {
    const { video_id: videoId } = request.params;
    Video.findOne({_id: videoId})
      .then(video => {
        if (!video) {
          return response.status(404).json(`Video with the id: ${videoId} was not found...`);
        }
        gfs.files.find({_id: video.file})
          .toArray((err, files) => {
            if (!files) {
              return response.status(404).json(err);
            }
            const videoObject = {
              _id: video._id,
              title: video.title,
              file: files[0],
              category: video.category
            }
            response.json(videoObject);
          })
      })
      .catch(error => {
        response.status(Http.NotFound).json(error);
      });
  },
  update(request, response) {
    const { video_id: videoId } = request.params;
    Video.findByIdAndUpdate(videoId, request.body, { new: true, runValidators: true })
      .then(video => {
        if (!video) {
          return response.status(404).json(`Video with the id: ${videoId} was not found...`);
        }
        gfs.files.find({_id: video.file})
          .toArray((err, files) => {
            if (!files) {
              return response.status(404).json(err);
            }
            const videoObject = {
              _id: video._id,
              title: request.body.title,
              file: files[0],
              category: request.body.category
            }
            response.json(videoObject)
          })
      })
      .catch(error => {
        const errors = Object.keys(error.errors).map(key => error.errors[key].message);
        response.status(Http.UnprocessableEntity).json(errors);
      })
  },
  destroy(request, response) {
    const {video_id: videoId} = request.params;
    Video.findByIdAndRemove(videoId)
      .then(video => {
        if (!video) {
          return response.status(404).json(`Video with the id: ${videoId} was not found...`);
        }
        gfs.files.deleteOne({_id: mongoose.Types.ObjectId(video.file)}, (err, file) => {
          if (err) {
            return response.status(Http.Conflict.json(err));
          }
          response.json(video);
        })
      })
      .catch(error => response.status(Http.Conflict.json(error)));
  },
}
