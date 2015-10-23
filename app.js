var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var passport=require('passport');
var session=require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors=require('cors');
//Initialize models
require('./models/models');

var index=require('./routes/index');
var api = require('./routes/api');
var authenticate = require('./routes/authenticate')(passport);


var mongoose=require('mongoose');
/*if(process.env.DEV_ENV) {*/
  //mongoose.connect("mongodb://localhost:27017/chrip-app");

mongoose.connect('mongodb://PeepIt:n8os1323zNeHDBsF8lMkxYV2S3svKjVH1skiLP21.T0-@ds042898.mongolab.com:42898/PeepIt');

var app = express();
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Origin,X-Custom-Header,X-Requested-With, Content-Type, Accept");
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({
  secret:'super duper secret'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());


//// Initialize Passport
var initPassport = require('./passport-init');
initPassport(passport);

app.use('/', index);
app.use('/api',api);
app.use('/auth', authenticate);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
