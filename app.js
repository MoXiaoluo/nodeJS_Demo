var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require("fs");
var routes = require('./routes/index');
var users = require('./routes/users');
var sec = require('./routes/sec');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/sec', sec);

// 使用 session 中间件
app.use(session({
  secret :  'secret', // 对session id 相关的cookie 进行签名
  resave : true,
  saveUninitialized: false, // 是否保存未初始化的会话
  cookie : {
      maxAge : 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
  },
}));

app.use(function(req,res,next){
  var url = req.url;
  // 判断不拦截的路由 出/login和/之外的都拦截
  if (url == '/sec' && !req.session.userName) {
    var err = new Error('Please Logon');
    err.status = 403;
    next(err);
  }else{
    next();
  }
});

app.use('/login',function(req,res,next){
  var url = req.url;
  // 判断不拦截的路由 出/login和/之外的都拦截
  // if (url == '/login') {
    fs.readFile('public/security.txt', function (err, data) {
      if (err) {
          return console.error(err);
      }
      var Json = JSON.parse(data.toString());
      if(req.body.username == Json.username && req.body.password == Json.password){
        req.session.userName = req.body.username; // 登录成功，设置 session
        console.log('req.session.userName ' +req.session.userName )
        res.redirect('/sec');
      }
      else{
          res.json({ret_code : 1, ret_msg : '账号或密码错误'});// 若登录失败，重定向到登录页面
      }
   });
  // }else{
  //   next();
  // }
});

app.get('/logon',function(req,res,next){
  res.render('logon',{title:'Logon'})
});

// 用户登录
app.post('/login', function(req, res,next){
  next();
});


//退出
app.get('/logoff', function (req, res) {
  req.session.userName = null; // 删除session
  res.redirect('/');
});


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
    
    if(err.status == 403){
      res.render('logon', { time: 3000, url: '/login' });
    }else{
      res.render('error', {
        message: err.message,
        error: err
      });
    }
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
