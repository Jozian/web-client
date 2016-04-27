const koa = require('koa');
const serve = require('koa-static');
const port = process.env.PORT || 3001;
const envirovment = process.env.NODE_ENV || 'production';
const router = require('koa-router')();
const fs = require('co-fs');
const webpack = require('webpack');
const clientId = process.env.CLIENT_ID || '0';

const app = koa();
app.use(serve('.'));

if (envirovment === 'development') {
  const webpackConfig = require('./webpack.config.js');
  const compiler = webpack(webpackConfig);
  app.use(require('koa-webpack-dev-middleware')(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath,
  }));

  app.use(require('koa-webpack-hot-middleware')(compiler, {
    log: console.log, path: '/__webpack_hmr', hearbeat: 10 * 1000,
  }));
}

router.get('/', function* landing() {
  const clientIdTpl = '${clientID}';
  const bodyHtml = yield fs.readFile('./main.html', 'utf8');

  this.body = bodyHtml.replace(clientIdTpl, clientId);
});

router.get('/admin/*', function* admin() {
  this.body = yield fs.readFile('./admin.html', 'utf8');
});
app.use(router.routes()).use(router.allowedMethods());
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

