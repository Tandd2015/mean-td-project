const router = require('express').Router();
const path = require('path');

module.exports = router.all('*', function(request, response) {
  const filePath = path.resolve('dist/mean-td-project/index.html');
  response.sendFile(filePath);
})
