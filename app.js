var express = require('express');
var path = require('path');
//收藏夹图标 /favicon.ico
var favicon = require('serve-favicon');
//记录一个请求 日志的
var logger = require('morgan');
//解析cookie req.cookies
var cookieParser = require('cookie-parser');
//解析请求体 req.body
var bodyParser = require('body-parser');
//路由文件
var routes = require('./routes/route_app');

var app = express();
var ejs = require('ejs');

//设置模板存放路径
app.set('views', path.join(__dirname, 'views'));

//设置.html后续的模板用ejs来进行渲染
app.engine('.html', ejs.__express);
//设置模板引擎
app.set('view engine', 'html');


// 客户端访问路径/favicon.ico的时候，服务器会返回 public目录下的 favicon.ico文件
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));//写请求日志的
app.use(bodyParser.json());//处理请求体格式为JSON的请求体
//处理请求体格式为urlencoded的请求体
app.use(bodyParser.urlencoded({ extended: false }));
//解析cookie
app.use(cookieParser());
//静态文件中间件
app.use(express.static(path.join(__dirname, 'public')));


//获得get请求，第一个参数是匹配内容，第二个参数是匹配成功后执行的回调函数
app.get('/vote/index', routes.index);  
app.get(/\/vote\/detail/, routes.detail);  
app.get('/vote/register', routes.register);  
app.get('/vote/search', routes.search); 
app.get('/vote/rule', routes.rule);

app.get('/vote/index/data', routes.index_data);
app.get(/\/vote\/index\/poll/, routes.index_poll);
app.get(/\/vote\/index\/search/, routes.index_search);
app.get(/\/vote\/all\/detail\/data/, routes.detail_data);

app.post(/\/vote\/register\/data/, routes.register_data);
app.post('/vote/index/info', routes.index_info);


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
