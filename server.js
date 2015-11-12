var webpack = require('webpack');
var koa = require('koa');
var serve = require('koa-static');
var config = require('./webpack.config');
var port = process.env.PORT || 3000;
var router = require('koa-router')();
var fs = require('co-fs');

var app = koa();
app.use(serve('.'));

router.get('/', function *(next) {
  var dataIndex = yield fs.readFile('./index.html');
  this.body = dataIndex.toString();
});
router.get('/admin/*', function *(next) {
  var adminIndex = yield fs.readFile('./admin.html');
  this.body = adminIndex.toString();
});
app.use(router.routes()).use(router.allowedMethods());
app.listen(port);

