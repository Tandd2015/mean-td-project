const ReviewApp = require('mongoose').model('ReviewApp');
const Review = require('mongoose').model('Review');
const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoURI = 'mongodb://localhost/tdpi';
let gfs;
let gfsT;
const { Http } = require('@status/codes');
const process = require('process');
const reviewUrl = 'https://www.google.com/maps/place/Terry+Dockery+Investigations+and+Security+Services/@41.0964478,-84.2638159,17z/data=!4m16!1m8!3m7!1s0x0:0x769d0e746c737a97!2sTerry+Dockery+Investigations+and+Security+Services!8m2!3d41.2102594!4d-83.807936!11m1!2e1!3m6!1s0x0:0x769d0e746c737a97!8m2!3d41.2102594!4d-83.807936!9m1!1b1?hl=en-US';
const altORDate = 'Terry Dockery Investigations and Security Services has not yet responded to customer review.';
let reviewProcessStop = false;

const deleteAll = () => {
  Review.find({})
    .then(reviews => {
      if (reviews.length === 0) {
        return console.log(`No Reviews found...`);
      }
      console.log("deleteAll Function", reviews[0]);
      for (let idx = 0; idx < reviews.length; idx++) {
        Review.findByIdAndRemove(reviews[idx]._id)
          .then(review => {
            if (!review) {
              return console.log(`Review with the id: ${review._id} was not found... \n`);
            }
          })
          .catch(error => console.log(error));
      }
    })
    .catch(error => console.log(error));
};

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

let connect = mongoose.createConnection(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.once('connected', () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
});

connect.once('open', () => {
  gfsT = new mongoose.mongo.GridFSBucket(connect.db, {bucketName: 'uploads'});
});


const createAllReviews = (reviews) => {
  return new Promise((resolve, reject) => {
    let createdReviewsHolder = [];
    for(let idx = 0; idx < reviews.length; idx++) {
      let newId = new mongoose.Types.ObjectId();
      Review.create({
        _id: newId,
        content: reviews[idx].content,
        writtenBy: reviews[idx].writtenBy,
        likes: reviews[idx].likes,
        byImage: reviews[idx].byImage,
        byContribute: reviews[idx].byContribute,
        byContributeLink: reviews[idx].byContributeLink,
        byRating: reviews[idx].byRating,
        byDate: reviews[idx].byDate,
        oResponse: reviews[idx].oResponse,
        oRDate: reviews[idx].oRDate
      })
        .then(createdReviews => {
          createdReviewsHolder.push(createdReviews)
          if(idx === reviews.length - 1){
            resolve(createdReviewsHolder);
          }
        })
        .catch(error => {
          const errors = Object.keys(error.errors).map(key => error.errors[key].message);
          console.log('createAllReviews() -- .catch() - Reviews created unsuccessfully', errors, '\n');
          resolve([]);
        });
    };
  });
};

module.exports = {
  index(_request, response) {
    if (reviewProcessStop === true) {
      throw new Error(`index() -- If statement 1 - Failed to navigate to ${reviewUrl} due to reviewProcessStop state ${reviewProcessStop}.`);
    };

    reviewProcessStop = true;

    const currentTime = Date.now();
    const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000;
    let timeOutR;
    let timeOutR2;
    let lastExecutionTimestamp;
    let retryReview = 15;
    let whileLoopStop = false;

    const thisProcessRemoverReview = () => {
      ['exit', 'SIGINT', 'SIGTERM', 'SIGHUP'].forEach(event => process.removeAllListeners(event));
    };

    const timeOutReview = async (ms) => {
      return new Promise((resolve, reject) => {
        timeOutR2 = setInterval(() => {
          if (whileLoopStop) {
            clearInterval(timeOutR2);
            resolve([]);
          }
        }, 1000);
        timeOutR = setTimeout(() => {
          clearInterval(timeOutR2);
          resolve([]);
        }, ms);
      });
    };

    const thisTimeOutReviewStop = () => {
      whileLoopStop = true;
      clearTimeout(timeOutR);
    }

    const timeOutPromiseReview = timeOutReview(180000).catch();

    const deleteAllManualReviews = (reviews) => {
      if (reviews.length === 0) {
        return console.log('deleteAllManualReviews -- If statement 1 - No Reviews found to Delete.', reviews, '\n');
      }
      for (let idx = 0; idx < reviews.length; idx++) {
        Review.findByIdAndRemove(reviews[idx]._id)
          .then(review => {
            if (!review) {
              console.log(`deleteAllManualReviews - Review.findByIdAndRemove() -- If Statement 1 - Review with the id: ${review._id} was not found... \n`);
            }
          })
          .catch(error => console.log(`deleteAllManualReviews - Review.findByIdAndRemove() -- .catch() - Review with the id: ${review._id} was not found... \n`, error, '\n'));
      }
    };

    const retryItReviews = async (reviewUrl, retryC) => {
      thisProcessRemoverReview();

      const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
      const page = await browser.newPage();

      if (retryC < 0) {
        throw new Error(`retryItReviews -- If Statement 1 - Failed to navigate to ${reviewUrl} after maximum allowed attempts. \n`);
      }

      return await Promise.race([Promise.all([
        await browser,
        await page,
        await page.goto(reviewUrl, {
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
            imageClass: 'NBa7we',
            userReviewSInfoclass: 'jftiEf fontBodyMedium',
            // userReviewSInfoclass: 'jftiEf L6Bbsd fontBodyMedium',
            ratingClass: 'kvMYJc',
            userReviewSLinkclass: 'WNxzHc qLhwHc'
          };
          const arrMaker = (arrSelector) => {
            const newArr = [];
            const contentArr = document.getElementsByClassName(arrSelector);
            for (let item of contentArr) {
              if (arrSelector === selectors.imageClass) {
                newArr.push(item.getAttribute('src'));
              } else if (arrSelector === selectors.ratingClass) {
                newArr.push(item.getAttribute('aria-label'));
              } else if (arrSelector === selectors.userReviewSInfoclass) {
                newArr.push(item.innerText.split('\n'));
              } else if (arrSelector === selectors.userReviewSLinkclass) {
                newArr.push(item.querySelector('button').getAttribute('data-href'));
              } else {
                newArr.push(item.innerText);
              }
            }
            return newArr;
          };
          const duplicateCheck = (subject1, subject2) => {
            const cleanedSubject1 = subject1.map(item => item === '   ' ? '' : item);
            return subject2.filter(item => !cleanedSubject1.includes(item));
          };
          const reviewSplitter = (reviewsObject) => {
            const reviewArr = [];
            const strTwo = ' ';
            for (let ind = 0; ind < reviewsObject.info.length; ind++) {
              const newReview = {
                content: reviewsObject.content[ind] || 'No written user text review.',
                writtenBy: reviewsObject.writtenBy[ind],
                likes: reviewsObject.likes[ind] || '0',
                byImage: reviewsObject.byImage[ind],
                byContribute: reviewsObject.byContribute[ind] || '0 reviews',
                byContributeLink: reviewsObject.byContributeLink[ind],
                byRating: reviewsObject.byRating[ind],
                byRating: reviewsObject.byRating[ind]?.split(strTwo[0], 2)[0],
                byDate: reviewsObject.byDate[ind],
                oResponse: reviewsObject.oResponse[ind] || 'No owner response for the review.',
                oRDate: reviewsObject.oRDate[ind] || 'No owner response date for the review.'
              };
              reviewArr.push(newReview);
            }
            return reviewArr;
          };
          const getAllSReviews = () => {
            let content = arrMaker('MyEned');
            let oResponse = arrMaker('wiI7pd');
            oResponse = duplicateCheck(content, oResponse);
            return {
              info: arrMaker(selectors.userReviewSInfoclass),
              content: content,
              writtenBy: arrMaker('d4r55'),
              likes: arrMaker('pkWtMe'),
              byImage: arrMaker(selectors.imageClass),
              byContribute: arrMaker('RfnDt'),
              byContributeLink: arrMaker(selectors.userReviewSLinkclass),
              byRating: arrMaker(selectors.ratingClass),
              byDate: arrMaker('rsqaWe'),
              oResponse: oResponse,
              oRDate: arrMaker('ODSEW-ShBeI-QClCJf-QYOpke-header')
            };
          };
          return reviewSplitter(getAllSReviews());
        }),
        await browser.close(),
      ]), timeOutPromiseReview
      ])
      .then((tryResponseReview) => {
        return new Promise((resolve, reject) => {
          if (tryResponseReview[tryResponseReview.length-2] !== undefined) {
            Review.find({})
              .then(reviews => {
                deleteAllManualReviews(reviews);
                createAllReviews(tryResponseReview[tryResponseReview.length-2])
                .then(newReviews => {
                  resolve(newReviews);
                })
                .catch(error => {
                  console.log('retryItReviews - createAllReviews -- .then-1 -- .catch-1 \n', error);
                  resolve([]);
                });
              })
              .catch(error => {
                console.log('retryItReviews - Review.find({}) -- .catch-1 \n', error);
                resolve([]);
              });
          };
          if (tryResponseReview[tryResponseReview.length-2] === undefined) {
            resolve([]);
          };
        });
      })
      .catch((e) => {
        return new Promise((resolve, reject) => {
          console.log(`retryItReviews -- .catch-1 ${e} occurred resulting in the failed to navigation to ${reviewUrl}, ${retryC-1} attempts left.`);
          resolve([]);
        })
      })
      .finally(() => {
        thisProcessRemoverReview();
        thisTimeOutReviewStop();
      })
    };
    Review.find({})
      .then(reviews => {
        reviewProcessStop = false;
        if (reviews.length !== 0) {
          lastExecutionTimestamp = reviews[0].createdAt;
        } else {
          lastExecutionTimestamp = 0;
        };

        if (currentTime - lastExecutionTimestamp < oneWeekInMillis) {
          response.json(reviews);
        } else {
          reviewProcessStop = false;
          retryItReviews(reviewUrl, retryReview)
            .then(rev => {
              response.json(rev);
            })
            .catch((err) => {
              console.log('Review.find({}) - retryItReviews - createAllReviews -- .catch-1', err, '\n', 'retryReview', retryReview, '\n');
              throw new Error(err)
            })
            .finally(() => {
              retryReview -= 1;
              thisTimeOutReviewStop();
              thisProcessRemoverReview();
              reviewProcessStop = false;
            })
        };
      })
      .catch(error => response.status(Http.InternalServerError).json(error));

  },
  show(request, response) {
    const { review_id: reviewAppId } = request.params;
    ReviewApp.findOne({_id: reviewAppId})
      .then(reviewApp => {
        if(!reviewApp) {
          return response.status(404).json(`App Review with id ${reviewAppId} not found!`);
        }
        gfsT.find({_id: mongoose.Types.ObjectId(reviewApp.byImage)})
          .toArray((err, files) => {
            if (!files) {
              return response.status(404).json(err);
            }
            return gfsT.openDownloadStreamByName(files[0].filename).pipe(response);
          });
      })
      .catch(error => {
        response.status(Http.NotFound).json(error);
      });
  },
  showTwo(request, response) {
    const { review_id: reviewAppId } = request.params;
    ReviewApp.findOne({_id: reviewAppId})
      .then(reviewApp => {
        if(!reviewApp) {
          return response.status(404).json(`App Review with id ${reviewAppId} not found!`);
        }
        gfs.files.find({_id: reviewApp.byImage})
          .toArray((err, files) => {
            if (!files) {
              return response.status(404).json(err);
            }
            const reviewAppObject = {
              _id: reviewApp._id,
              content: reviewApp.content,
              likes: reviewApp.likes,
              writtenBy: reviewApp.writtenBy,
              byImage: files[0],
              byImagePath: reviewApp.byImagePath,
              byRating: reviewApp.byRating,
              createdAt: reviewApp.createdAt,
              updatedAt: reviewApp.updatedAt,
              oAnswered: reviewApp.oAnswered,
              oResponse: reviewApp.oResponse,
              oRDate: reviewApp.oRDate,
            };
            response.json(reviewAppObject);
          });
      })
      .catch(error => {
        response.status(Http.NotFound).json(error);
      });
  },
  indexAlt(_request, response) {
    ReviewApp.find({})
      .then(appReviews => {
        if (!appReviews) {
          return response.status(404).json(`No Reviews was found... ${appReviews}`);
        }
        gfs.files.find({})
          .toArray((err, files) => {
            if (!files) {
              return response.status(404).json(err);
            }
            appReviews.forEach((appReview, index, array) => {
              if (!appReview) {
                return response.status(404).json(`No Review with the id: ${appReview._id} was found...`);
              }
              files.forEach(byImage => {
                const reviewAppObject = (appReview.byImage.toString() === byImage._id.toString()) ? {
                  _id: appReview._id,
                  content: appReview.content,
                  likes: appReview.likes,
                  writtenBy: appReview.writtenBy,
                  byImage: byImage,
                  byImagePath: appReview.byImagePath,
                  byRating: appReview.byRating,
                  createdAt: appReview.createdAt,
                  updatedAt: appReview.updatedAt,
                  oAnswered: appReview.oAnswered,
                  oResponse: appReview.oResponse,
                  oRDate: appReview.oRDate,
                } : null;
                if (reviewAppObject != null) {
                  array[index] = reviewAppObject;
                }
              });
            });
            response.json(appReviews);
          });
      })
      .catch(error => response.status(Http.InternalServerError).json(error));
  },
  create(request, response) {
    const upload = multer({ storage: storage, fileFilter: imageFilter }).single('byImage');
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
      let pathFile = `http://localhost:5000/api/home/reviews/${newId}`;
      ReviewApp.create({
        _id: newId,
        content: request.body.content,
        writtenBy: request.body.writtenBy,
        byImage: request.file.id,
        byImagePath: pathFile,
        byRating: request.body.byRating,
      })
      .then(reviewApp => {
        const reviewObject = reviewApp.toObject();
        response.json(reviewObject);
      })
      .catch(err => {
        const errors = Object.keys(err.errors).map(key => err.errors[key].message);
        response.status(Http.UnprocessableEntity).json(errors);
      });
    });
  },
  update(request, response) {
    const { review_id: reviewAppId } = request.params;
    ReviewApp.findByIdAndUpdate(reviewAppId, request.body, { new: true, runValidators: true })
      .then(reviewApp => {
        if (!reviewApp) {
          return response.status(404).json(`Review with the id: ${reviewAppId} was not found...`);
        }
        gfs.files.find({_id: reviewApp.byImage})
          .toArray((err, files) => {
            if (!files) {
              return response.status(404).json(err);
            }
            const reviewAppObject = {
              _id: reviewApp._id,
              content: reviewApp.content,
              likes: reviewApp.likes,
              writtenBy: reviewApp.writtenBy,
              byImage: files[0],
              byRating: reviewApp.byRating,
              createdAt: reviewApp.createdAt,
              updatedAt: reviewApp.updatedAt,
              oAnswered: reviewApp.oAnswered,
              oResponse: reviewApp.oResponse,
              oRDate: reviewApp.oRDate,
            };
            response.json(reviewAppObject);
          });
      })
      .catch(error => {
        const errors = Object.keys(error.errors).map(key => error.errors[key].message);
        response.status(Http.UnprocessableEntity).json(errors);
      });
  },
  destroy(request, response) {
    const { review_id: reviewAppId } = request.params;
    ReviewApp.findByIdAndRemove(reviewAppId)
      .then(reviewApp => {
        if (!reviewApp) {
          return response.status(404).json(`Review with the id: ${reviewAppId} was not found...`);
        }
        gfs.files.deleteOne({_id: mongoose.Types.ObjectId(reviewApp.byImage)}, (err, file) => {
          if (err) {
            return response.status(Http.Conflict.json(err));
          }
          response.json(reviewApp);
        });
      })
      .catch(error => response.status(Http.Conflict).json(error));
  }
};
