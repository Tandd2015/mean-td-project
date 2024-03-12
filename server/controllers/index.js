const AuthController = require('./auth.controller');
const PostController = require('./post.controller');
const ImageController = require('./image.controller');
const VideoController = require('./video.controller');
const ReviewController = require('./review.controller');
const SectionController = require('./section.controller');
const ApiController = require('./api.controller');

module.exports = {
  AuthController,
  ApiController,
  PostController,
  ImageController,
  ReviewController,
  VideoController,
  SectionController
}
