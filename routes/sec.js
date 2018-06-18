var express = require('express');
var router = express.Router();
var fs = require("fs");
var session = require('express-session');
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// 使用 session 中间件
router.use(session({
    secret :  'secret', // 对session id 相关的cookie 进行签名
    resave : true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie : {
        maxAge : 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
    },
  }));
/* GET sec listing. */
router.get('/', function(req, res, next) {
    if(req.session.userName){
        fs.readFile('ReadMe.md', function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.render('securityDoc', { content: data.toString(),button:'print'});
            console.log("异步读取: " + data);
         });
    }else{
        res.redirect('/logon');
    }
    
});
// router.get('/print', function(req, res, next) {
//     fs.readFile('ReadMe.md', function (err, data) {
//         if (err) {
//             return console.error(err);
//         }
//         //var docDefinition = data;
//         var docDefinition = { content: 'This is an sample PDF printed with pdfMake' };
//         pdfMake.createPdf(docDefinition).print();
//      });
// });

module.exports = router;