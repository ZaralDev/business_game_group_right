const VIEW_PATH = require('../config.js').VIEW_PATH;
var express = require('express');
var router = express.Router();
/* GET home pages. */
router.get('/', function (req, res, next) {
  res.render('hotel', {});
});

module.exports = router;
