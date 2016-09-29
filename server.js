const koa = require('koa');
const serve = require('koa-static');
const mount = require('koa-mount');
const port = process.env.PORT || 3001;
const envirovment = process.env.NODE_ENV || 'production';
const router = require('koa-router')();
const fs = require('co-fs');
const $proxy = require('koa-http-proxy');
const webpack = require('webpack');
const clientId = process.env.CLIENT_ID || '0';
const https = require('https');
const app = koa();
app.use(mount('/api', $proxy(process.env.SERVER_ENDPOINT || 'http://localhost:3000/api')));
app.use(mount('/content', $proxy(process.env.SERVER_ENDPOINT || 'http://localhost:3000/content')));
app.use(mount('/preview', $proxy(process.env.SERVER_ENDPOINT || 'http://localhost:3000/preview')));
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

/*router.get('/liveIdAuth', function* () {
  var response = this.request.query;

  console.log(setLocalStorageData);

  setLocalStorageData('MEDtoken', response.token);
  setLocalStorageData('MEDuser', response.user);

  this.body = yield fs.readFile('./admin.html', 'utf8');
});*/

router.get('/', function* landing() {
  const clientIdTpl = '${clientID}';
  const bodyHtml = yield fs.readFile('./main.html', 'utf8');

  this.body = bodyHtml.replace(clientIdTpl, clientId);
});

router.get('/admin/*', function* admin() {
  this.body = yield fs.readFile('./admin.html', 'utf8');
});
app.use(router.routes()).use(router.allowedMethods());

if (process.env.USE_HTTPS) {
  const options = {
    pfx: require('fs').readFileSync('./med.pfx'),
    passphrase: process.env.HTTPS_PASSPHRASE
  };
  require('https').createServer(options, app.callback()).listen(port, () => {
    console.log(`Server started in https mode on ${port}`);
  }); 
} else {
  app.listen(port, () => {
   console.log(`Server started on port ${port}`);
  });
}

