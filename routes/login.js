var express = require('express');
var router = express.Router();
const VIEW_PATH = require('../config.js').VIEW_PATH;

/* GET home pages. */
router.get('/', function (req, res, next) {
  res.render('login', {});
});

module.exports = router;
