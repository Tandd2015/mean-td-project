const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const process = require('process');
const port = process.env.PORT;
require('dotenv').config();
const tdApp = express();
// process.once('warning', (warning) => {
//   console.warn('Warning Stack Trace =>' + warning.stack)
// })

require('./server/config/tdDatabase');

tdApp
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname,'dist','mean-td-project')))
  .use(cookieParser(`${process.env.COOKIE_PARSER_SECRET_KEY}`))
  .use(session({
    saveUninitialized: true,
    secret: `${process.env.SESSION_SECRET_KEY}`,
    resave: false,
    name: "session",
    rolling: true,
    cookie: {
      secure: true,
      sameSite: 'strict',
      httpOnly: true,
      maxAge:3600000
    }
  }))
  .use(require('./server/routes'))
  .listen(port);
