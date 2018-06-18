var express = require('express');
var router = express.Router();
var session = require('express-session');

// 使用 session 中间件
router.use(session({
  secret :  'secret', // 对session id 相关的cookie 进行签名
  resave : true,
  saveUninitialized: false, // 是否保存未初始化的会话
  cookie : {
      maxAge : 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
  },
}));

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.userName != undefined && req.session.userName){  //判断session 状态，如果有效，则返回主页，否则转到登录页面
    res.render('index', { title: 'Express',items:[{"button":"Welcome", "link":"/"},{"button":"Security Doc", "link":"/sec"},{"button":"Logoff", "link":"/logoff"}],username : req.session.userName });
  }else{
    res.render('index', { title: 'Express',items:[{"button":"Welcome", "link":"/"},{"button":"Security Doc", "link":"/sec"},{"button":"Logoff", "link":"/logoff"}],username : 'please logon' });
  }
});

module.exports = router;
