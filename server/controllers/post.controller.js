const PostApp = require('mongoose').model('PostApp');
const Post = require('mongoose').model('Post');
const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoURI = 'mongodb://localhost/tdpi';
let gfs;
let gfsP;
const { Http } = require('@status/codes');
const process = require('process');
const postUrl = 'https://www.google.com/maps/place/Terry+Dockery+Investigations+and+Security+Services/@41.2428323,-84.281979,8.42z/data=!4m16!1m8!3m7!1s0x0:0x769d0e746c737a97!2sTerry+Dockery+Investigations+and+Security+Services!8m2!3d41.2102594!4d-83.807936!11m1!2e1!3m6!1s0x0:0x769d0e746c737a97!8m2!3d41.2102594!4d-83.807936!11m1!2e1?hl=en-US';
let postProcessStop = false;

const fileFilter = function(req, file, cb) {
  if (!file.originalname.match(/\.(mp4|MP4|mov|MOV|wmv|WMV|flv|FLV|avi|AVI|avchd|AVCHD|webm|WEBM|mkv|MKV|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only video or image files are allowed!';
    return cb(new Error('Only video files are allowed!'), false);
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

let connect = mongoose.createConnection(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.once('connected', () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
});

connect.once('open', () => {
  gfsP = new mongoose.mongo.GridFSBucket(connect.db, {bucketName: 'uploads'});
});

const createAllPosts = (posts) => {
  return new Promise((resolve, reject) => {
    let createdPostHolder = [];
    for(let idx = 0; idx < posts.length; idx++) {
      let newId = new mongoose.Types.ObjectId();
      Post.create({
        _id: newId,
        content: posts[idx].content,
        contentImages: posts[idx].contentImages,
        writtenBy: posts[idx].writtenBy,
        byImage: posts[idx].byImage,
        byDate: posts[idx].byDate,
      })
        .then(createdPosts => {
          createdPostHolder.push(createdPosts)
          if(idx === posts.length - 1){
            // console.log('Posts created successfully', createdPostHolder[0], '\n');
            resolve(createdPostHolder);
          }
        })
        .catch(error => {
          const errors = Object.keys(error.errors).map(key => error.errors[key].message);
          console.log('createAllPosts() -- .catch() - Posts created unsuccessfully', errors, '\n');
          resolve([]);
        });
    };
  });
};

module.exports = {
  index(_request, response) {

    if (postProcessStop === true) {
      throw new Error(`index() -- If statement 1 - Failed to navigate to ${postUrl} due to postProcessStop state ${postProcessStop}.`);
    };

    postProcessStop = true;

    const currentTime = Date.now();
    const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000;
    let timeOutP;
    let timeOutP2;
    let lastExecutionTimestamp;
    let retryPost = 15;
    let postWhileLoopStop = false;

    const thisProcessRemoverPost = () => {
      ['exit', 'SIGINT', 'SIGTERM', 'SIGHUP'].forEach(event => process.removeAllListeners(event));
    };

    const timeOutPost = (ms) => {
      return new Promise((resolve, reject) => {
        timeOutP2 = setInterval(() => {
          if (postWhileLoopStop) {
            clearInterval(timeOutP2);
            resolve([]);
          }
        }, 1000);
        timeOutP = setTimeout(() => {
          clearInterval(timeOutP2);
          resolve([]);
        }, ms);
      });
    };

    const thisTimeOutPostStop = () => {
      postWhileLoopStop = true;
      clearTimeout(timeOutP);
    };

    const timeOutPromisePost = timeOutPost(180000).catch();
    // const timeOutPromisePost = timeOutPost(180000).catch((eT) => console.log('TimeOutPromisePost Error Catch', eT));

    const deleteAllManualPosts = (posts) => {
      if (posts.length === 0) {
        return console.log('deleteAllManualPosts -- If statement 1 - No posts found to Delete.', posts, '\n');
      }
      for (let idx = 0; idx < posts.length; idx++) {
        Post.findByIdAndRemove(posts[idx]._id)
          .then(post => {
            if (!post) {
              console.log(`deleteAllManualPosts - Post.findByIdAndRemove() -- If Statement 1 - Post with the id: ${post._id} was not found... \n`);
            }
          })
          .catch(error => console.log(`deleteAllManualPosts - Post.findByIdAndRemove() -- .catch() - Post with the id: ${post._id} was not found... \n`, error, '\n'));
      }
    };

    let retryItPosts = async (postUrl, retryP) => {
      thisProcessRemoverPost();

      const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
      const page = await browser.newPage();

      if (retryP < 0) {
        throw new Error(`retryItPosts -- If Statement 1 - Failed to navigate to ${postUrl} after maximum allowed attempts. \n`);
      };

      return await Promise.race([Promise.all([
        await browser,
        await page,
        await page.goto(postUrl, {
          waitUntil: 'load',
          timeout: 600000
        }),
        await page.waitForNavigation({
          waitUntil: ['load', "networkidle2"],
          timeout: 600000
        }),
        await page.waitForResponse(responses => responses.ok()),
        await page.evaluate(() => {
          const selectors = {
            byImageClass : 'jE1Ghf',
            postImageClass : 'tTCrvf',
            postContentClass : 'hfJtQe',
            altPostContentClass : 'Jbl1pc',
            writtenBy: 'kf0LHf',
            byDate: 'mgX1W',
          };

          const arrMaker = (arrSelector) => {
            let newArr = [];
            let count = 0;
            let altPostsArr = document.getElementsByClassName(selectors.altPostContentClass);
            let contentArr = document.getElementsByClassName(arrSelector);
            if (arrSelector === selectors.byImageClass) {
              for(let one of contentArr) {
                newArr.push(one.getAttribute('src'));
              }
            } else if(arrSelector === selectors.postImageClass && selectors.postImageClass === undefined) {
              selectors.postImageClass = [];
            } else if(arrSelector === selectors.postImageClass && selectors.postImageClass !== undefined) {
              for(let two of contentArr) {
                newArr.push(two.getAttribute('src'));
              }
            }
            else if (arrSelector === selectors.postContentClass) {
              for(let item of contentArr) {
                if (item.innerText === '') {
                  newArr.push(altPostsArr[count].innerText);
                  count++;
                } else {
                  newArr.push(item.innerText);
                }
              }
            }
            else {
              for(let item of contentArr) {
                newArr.push(item.innerText);
              }
            }
            return newArr;
          };
          const postSplitter = (postsObject) => {
            let postArr = [];
            for(let i = 0; i<postsObject.byDate.length; i++) {
              let newPost = {
                content: postsObject.content[i],
                contentImages: postsObject.contentImages[i] || [],
                writtenBy: postsObject.writtenBy[i],
                byImage: postsObject.byImage[i],
                byDate: postsObject.byDate[i],
              };
              postArr.push(newPost);
            }
            return postArr;
          };
          const getAllSPosts = () => {
            return {
              content: arrMaker(selectors.postContentClass),
              contentImages: arrMaker(selectors.postImageClass),
              writtenBy: arrMaker(selectors.writtenBy),
              byImage: arrMaker(selectors.byImageClass),
              byDate: arrMaker(selectors.byDate),
            };
          };
          return postSplitter(getAllSPosts());
        }),
        await browser.close(),
      ]), timeOutPromisePost
      ])
      .then((tryResponsePost) => {
        return new Promise((resolve, reject) => {
          if (tryResponsePost[tryResponsePost.length-2] !== undefined) {
            Post.find({})
              .then(posts => {
                deleteAllManualPosts(posts);
                createAllPosts(tryResponsePost[tryResponsePost.length-2])
                  .then(newPosts => {
                    resolve(newPosts);
                  })
                  .catch(error => {
                    console.log('retryItPosts - createAllPosts -- .then-1 -- .catch-1 \n', error);
                    resolve([]);
                  });
              })
              .catch(error => {
                console.log('retryItPosts - Post.find({}) -- .catch-1 \n', error);
                resolve([]);
              });
          };
          if (tryResponsePost[tryResponsePost.length-2] === undefined) {
            resolve([]);
          };
        });
      })
      .catch((e) => {
        return new Promise((resolve) => {
          console.log(`retryItPosts -- .catch-1 ${e} occurred resulting in the failed to navigation to ${postUrl}, ${retryP-1} attempts left.`);
          resolve([]);
        });
      })
      .finally(() => {
        thisProcessRemoverPost();
        thisTimeOutPostStop();
      });
    };

    Post.find({})
    .then(posts => {
      postProcessStop = false;
      if (posts.length !== 0) {
        lastExecutionTimestamp = posts[0].createdAt;
      } else {
        lastExecutionTimestamp = 0;
      };

      if (currentTime - lastExecutionTimestamp < oneWeekInMillis) {
        response.json(posts);
      } else {
        console.log('hello', currentTime, lastExecutionTimestamp, oneWeekInMillis);
        postProcessStop = false;
        retryItPosts(postUrl, retryPost)
          .then(pos => {
            response.json(pos);
          })
          .catch((err) => {
            console.log('Post.find({}) - retryItPosts - createAllPosts -- .catch-1', err, '\n', 'retryPost', retryPost, '\n');
            throw new Error(err)
          })
          .finally(() => {
            retryPost -= 1;
            thisTimeOutPostStop();
            thisProcessRemoverPost();
            postProcessStop = false;
          })
      };
    })
    .catch(error => response.status(Http.InternalServerError).json(error));
  },
  indexAlt(_request, response) {
    PostApp.find({})
    .then(posts => {
      if (!posts) {
        return response.status(404).json(`No Posts ${posts} was found...`);
      }
      gfs.files.find({})
        .toArray((err, files) => {
          if (!files) {
            return response.status(404).json(err);
          }
          posts.forEach((post, index, array) => {
            files.forEach(file => {
              post.images.forEach((imageObjectId, indexImages, arrayImages) => {
                if(imageObjectId.toString() === file._id.toString()) {
                  arrayImages[indexImages] = file;
                }
              });
              post.videos.forEach((videoObjectId, indexVideos, arrayVideos) => {
                if(videoObjectId.toString() === file._id.toString()) {
                  arrayVideos[indexVideos] = file;
                }
              });
              if (post.mainImage === null) {
                return;
              } else if(post.mainImage.toString() === file._id.toString()) {
                const postObject = {
                  _id: post._id,
                  content: post.content,
                  writtenBy: post.writtenBy,
                  category: post.category,
                  likes: post.likes,
                  mainImage: file,
                  mainImagePath: post.mainImagePath,
                  images: post.images,
                  imagesPaths: post.imagesPaths,
                  videos: post.videos,
                  videosPaths: post.videosPaths,
                  createdAt: post.createdAt,
                  updatedAt: post.updatedAt
                };
                array[index] = postObject;
              }
            });
          });
          response.json(posts);
        });
    })
    .catch(error => response.status(Http.InternalServerError).json(error));
  },
  create(request, response) {
    const upload = multer({ storage: storage, fileFilter: fileFilter }).fields([{name: 'mainImage', maxCount: 1}, {name: 'images', maxCount: 3}, {name: 'videos', maxCount: 3}]);
    upload(request, response, (error) => {
      if (request.fileValidationError) {
        return response.send(request.fileValidationError);
      } else if (!request.files) {
        return response.send('Please select correct format of file to upload');
      } else if (error instanceof multer.MulterError) {
        return response.send(error);
      } else if (error) {
        return response.send(error);
      }
      let newId = new mongoose.Types.ObjectId();
      let mainImageNewPathFile = (!request.files.mainImage) ? `http://localhost:5000/api/home/posts/${newId}/${request.body.mainImageO}` : `http://localhost:5000/api/home/posts/${newId}/${request.files.mainImage[0].id}`;
      let mainImage = (!request.files.mainImage) ? request.body.mainImageO : request.files.mainImage[0].id;
      let images = [];
      let videos = [];
      let imagesPaths = [];
      let videosPaths = [];
      for (const key in request.files.images) {
        images[key] = mongoose.Types.ObjectId(request.files.images[key].id);
        let imagesNewPathFile = `http://localhost:5000/api/home/posts/${newId}/${request.files.images[key].id}`;
        imagesPaths[key] = imagesNewPathFile;
      }
      for (const key in request.files.videos) {
        videos[key] = mongoose.Types.ObjectId(request.files.videos[key].id);
        let videosNewPathFile = `http://localhost:5000/api/home/posts/${newId}/${request.files.videos[key].id}`;
        videosPaths[key] = videosNewPathFile;
      }
      PostApp.create({
        _id: newId,
        content: request.body.content,
        category: request.body.category,
        mainImage: mainImage,
        mainImagePath: mainImageNewPathFile,
        images: images,
        imagesPaths: imagesPaths,
        videos: videos,
        videosPaths: videosPaths
      })
      .then(postApp => {
        const postObject = postApp.toObject();
        response.json(postObject);
      })
      .catch(err => {
        const errors = Object.keys(err.errors).map(key => err.errors[key].message);
        response.status(Http.UnprocessableEntity).json(errors);
      });
    });
  },
  showTwo(request, response) {
    let postObject = {};
    const { post_id: postId } = request.params;
    PostApp.findOne({_id: postId})
      .then(post => {
        if (!post) {
          throw new Error(`Post with the id: ${postId} was not found...`);
        }
        gfs.files.find({})
          .toArray((err, files) => {
            if (!files) {
              return response.status(404).json(err);
            }
            files.forEach(file => {
              post.images.forEach((imgObjectId, indexImgs, arrayImgs) => {
                if(imgObjectId.toString() === file._id.toString()) {
                  arrayImgs[indexImgs] = file;
                }
              });
              post.videos.forEach((vidObjectId, indexVids, arrayVids) => {
                if(vidObjectId.toString() === file._id.toString()) {
                  arrayVids[indexVids] = file;
                }
              });
              if(post.mainImage.toString() === file._id.toString()) {
                postObject.mainImage = file;
              }
            });
            postObject = {
              _id: post._id,
              title: post.title,
              content: post.content,
              writtenBy: post.writtenBy,
              category: post.category,
              likes: post.likes,
              mainImage: postObject.mainImage,
              mainImagePath: post.mainImagePath,
              images: post.images,
              imagesPaths: post.imagesPaths,
              videos: post.videos,
              videosPaths: post.videosPaths,
              createdAt: post.createdAt,
              updatedAt: post.updatedAt
            };
            post = postObject;
            response.json(post);
          });
      })
      .catch(error => {
        response.status(Http.NotFound).json(error);
      });
  },
  show(request, response) {
    const { post_id: postId } = request.params;
    const { mainImage_id: mainImageId } = request.params;
    PostApp.findOne({_id: postId})
    .then(postApp => {
      if (!postApp) {
        throw new Error(`App Post with the id: ${postId} was not found...`);
      }
      gfsP.find({_id: mongoose.Types.ObjectId(mainImageId)})
        .toArray((err, files) => {
          if (!files) {
            return response.status(404).json(err);
          }
          return gfsP.openDownloadStreamByName(files[0].filename).pipe(response);
        });
      })
      .catch(error => {
        response.status(Http.NotFound).json(error);
      });
  },
  update(request, response) {
    const { post_id: postId } = request.params;
    const upload = multer({ storage: storage, fileFilter: fileFilter }).fields([{name: 'mainImage', maxCount: 1}, {name: 'images', maxCount: 3}, {name: 'videos', maxCount: 3}]);
    upload(request, response, (error) => {
      let newObject = JSON.parse(request.body.newObject);
      delete request.body.newObject;
      if (request.fileValidationError) {
        return response.send(request.fileValidationError);
      } else if (error instanceof multer.MulterError) {
        return response.send(error);
      } else if (error) {
        return response.send(error);
      }

      let imagesNewPathFile = '';
      let images = [];
      let imagesPaths = [];
      if (request.files.images) {
        for (const key in request.files.images) {
          images[key] = mongoose.Types.ObjectId(request.files.images[key].id);
          imagesNewPathFile = `http://localhost:5000/api/home/posts/${postId}/${request.files.images[key].id}`;
          imagesPaths[key] = imagesNewPathFile;
        }
        request.body.images = images;
        request.body.imagesPaths = imagesPaths;
      } else {
        request.body.images = newObject.images;
        request.body.imagesPaths = newObject.imagesPaths;
        newObject.images = null;
        newObject.imagesPaths = null;
      }

      let videosNewPathFile = '';
      let videos = [];
      let videosPaths = [];
      if (request.files.videos) {
        for (const key in request.files.videos) {
          videos[key] = mongoose.Types.ObjectId(request.files.videos[key].id);
          videosNewPathFile = `http://localhost:5000/api/home/posts/${postId}/${request.files.videos[key].id}`;
          videosPaths[key] = videosNewPathFile;
        }
        request.body.videos = videos;
        request.body.videosPaths = videosPaths;
      } else {
        request.body.videos = newObject.videos;
        request.body.videosPaths = newObject.videosPaths;
        newObject.videos = null;
        newObject.videosPaths = null;
      }

      let mainImageNewPathFile = '';
      if (request.files.mainImage) {
        let newMainImageId = mongoose.Types.ObjectId(request.files.mainImage[0].id);
        mainImageNewPathFile = `http://localhost:5000/api/home/posts/${postId}/${request.files.mainImage[0].id}`;
        request.body.mainImage = newMainImageId;
        request.body.mainImagePath = mainImageNewPathFile;
      } else {
        request.body.mainImage = newObject.mainImage;
        request.body.mainImagePath = newObject.mainImagePath;
        newObject.mainImage = null;
        newObject.mainImagePath = null;
      }
      PostApp.findByIdAndUpdate(postId, request.body, { new: true, runValidators: true })
        .then(post => {
          if (!post) {
            return response.status(404).json(`Post with the id: ${postId} was not found...`);
          }
          if (newObject.images !== null) {
            newObject.images.forEach((imageDUObjectId, indexDUImages, arrayDUImages) => {
              gfs.files.deleteOne({_id: mongoose.Types.ObjectId(imageDUObjectId._id)});
            });
            newObject.images = null;
            newObject.imagesPaths = null;
          }
          if (newObject.videos !== null) {
            newObject.videos.forEach((videoDUObjectId, indexDUVideos, arrayDUVideos) => {
              gfs.files.deleteOne({_id: mongoose.Types.ObjectId(videoDUObjectId._id)});
            });
            newObject.videos = null;
            newObject.videosPaths = null;
          }
          if (newObject.mainImage !== null) {
            gfs.files.deleteOne({_id: mongoose.Types.ObjectId(newObject.mainImage._id)});
            newObject.mainImage = null;
            newObject.mainImagePath = null;
          }
          gfs.files.find({})
            .toArray((err, files) => {
              if (!files) {
                return response.status(404).json(err);
              }
              files.forEach(file => {
                post.images.forEach((imageUObjectId, indexUImages, arrayUImages) => {
                  if(imageUObjectId.toString() === file._id.toString()) {
                    arrayUImages[indexUImages] = file;
                  }
                });
                post.videos.forEach((videoUObjectId, indexUVideos, arrayUVideos) => {
                  if(videoUObjectId.toString() === file._id.toString()) {
                    arrayUVideos[indexUVideos] = file;
                  }
                });
                if (post.mainImage.toString() === file._id.toString()) {
                  post.mainImage = file;
                }
              });
              response.json(post);
            });
        })
        .catch(error => {
          const errors = Object.keys(error.errors).map(key => error.errors[key].message);
          response.status(Http.UnprocessableEntity).json(errors);
        });
      });
  },
  destroy(request, response) {
    const { post_id: postId } = request.params;
    let duplicateCheckDestroy = false;
    PostApp.findByIdAndRemove(postId)
      .then(post => {
        if (!post) {
          return response.status(404).json(`Post with the id: ${postId} was not found...`);
        }
        PostApp.find({})
          .then(posts => {
            if (!posts) {
              return response.status(404).json(`No Posts ${posts} was found...`);
            }
            gfs.files.find({})
              .toArray((err, files) => {
                if (!files) {
                  return response.status(404).json(err);
                }
                files.forEach(file => {
                  post.images.forEach((imageObjectId, indexImages, arrayImages) => {
                    if(imageObjectId.toString() === file._id.toString()) {
                      gfs.files.deleteOne({_id: mongoose.Types.ObjectId(arrayImages[indexImages])});
                    }
                  });
                  post.videos.forEach((videoObjectId, indexVideos, arrayVideos) => {
                    if(videoObjectId.toString() === file._id.toString()) {
                      gfs.files.deleteOne({_id: mongoose.Types.ObjectId(arrayVideos[indexVideos])});
                    }
                  });
                  posts.forEach((postObject, indexPost, arrayPost) => {
                    console.log('postObject', postObject, 'indexPost', indexPost, 'arrayPost', arrayPost);
                    if(postObject.mainImage.toString() === post.mainImage.toString()) {
                      duplicateCheckDestroy = true;
                    }
                  })
                  if (post.mainImage.toString() === file._id.toString() && duplicateCheckDestroy !== true) {
                    gfs.files.deleteOne({_id: mongoose.Types.ObjectId(post.mainImage)});
                  }
                });
              });
            response.json(post);
          })
          .catch(error => response.status(Http.Conflict).json(error))
      })
      .catch(error => response.status(Http.Conflict).json(error));
  }
};
