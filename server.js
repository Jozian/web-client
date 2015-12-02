const koa = require('koa');
const serve = require('koa-static');
const port = process.env.PORT || 3000;
const router = require('koa-router')();
const fs = require('co-fs');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const compiler = webpack(webpackConfig);

const app = koa();
app.use(serve('.'));
app.use(require('koa-webpack-dev-middleware')(compiler, {
  noInfo: true, publicPath: webpackConfig.output.publicPath,
}));

app.use(require('koa-webpack-hot-middleware')(compiler));

router.get('/', function* landing() {
  this.body = yield fs.readFile('./index.html', 'utf8');
});
router.get('/admin/*', function* admin() {
  this.body = yield fs.readFile('./admin.html', 'utf8');
});
app.use(router.routes()).use(router.allowedMethods());
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

