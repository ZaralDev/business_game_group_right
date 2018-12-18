const VIEW_PATH = require('../config.js').VIEW_PATH;
var express = require('express');
var router = express.Router();
/* GET home pages. */
router.get('/', function (req, res, next) {
  res.sendFile('index2.html',  { root: VIEW_PATH });
});
router.get('/index', function (req, res, next) {
  res.redirect('/');
});
router.get('/inscription', function (req, res, next) {
  res.redirect('/register');
});

module.exports = router;
