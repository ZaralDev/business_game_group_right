var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const axios = require('axios');
const API_URL = require('./config.js').API_URL;
var app = express();

var routes = [
  {path: '/', dir: 'index'},
  {path: '/hotel', dir: 'hotel'},
  {path: '/register', dir: 'register'},
  {path: '/parc', dir: 'parc'},
  {path: '/reservation', dir: 'reservation'},
  {path: '/login', dir: 'login'},
  {path: '/poleaquatique', dir: 'poleaquatique'},
  {path: '/polerealite', dir: 'polerealite'},
  {path: '/polesport', dir: 'polesport'},
  {path: '/parcenfant', dir: 'parcenfant'},
  {path: '/carte', dir: 'carte'},
  {path: '/hebergement', dir: 'hebergement'},
  {path: '/paiement', dir: 'paiement'},



];


function initExpress() {
  // view engine setup
  app.set('views', path.join(__dirname, '/views'));
  app.set('view engine', 'ejs');
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
}

function loadRoutes() {
  for (let route of routes) {
    var routeRequire = require('./routes/' + route.dir);
    app.use(route.path, routeRequire);
  }
}

function catchErrors() {
  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });
  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error pages
    res.redirect('/error');
    /* res.status(err.status || 500);
     res.render('error');*/
  });
}

function sendValid(req) {
  return new Promise(function (resolve, reject) {
    const id = req.cookies.id;
    const token = req.cookies.token;
    axios.request({
      url: API_URL + "check",
      method: "POST",
      headers: {
        Cookie: "id=" + id + "; token=" + token + ";",
        'User-Agent': req.headers['user-agent']
      }
    }).then(function (response) {
      resolve();
    }).catch(function (error) {
      reject(error.response);
    })
  });
}

function loadMiddleware() {
  app.use(function (req, res, next) {
    const result = routes.filter(route => route.path === req.originalUrl.toLowerCase());
    if (result.length === 0) {
      next();
      return;
    }
    if (!req.originalUrl.toLowerCase().startsWith("/error")
        && !req.originalUrl.startsWith("/favicon")) {
      console.log(req.originalUrl);

  const promise = sendValid(req);
  promise.then(function (result) {
    console.log("OK");
    if (req.originalUrl.startsWith("/login") || req.originalUrl.startsWith("/register")) {
      res.redirect('/');
      return;
    }
    next();
  }, function (error) {
    if (error.status === 400) {

      const data = error.data;
      console.log(data);
      if (!req.originalUrl.startsWith("/login") && !req.originalUrl.startsWith("/register")) {
        res.redirect('/login');
        return;
      }
      next();
    }
  });

} else {
  console.log("Pass");
  next();
}

});

}

initExpress();
//loadMiddleware();
loadRoutes();
//catchErrors();


module.exports = app;
