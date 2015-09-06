var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var port = process.env.PORT || 3000;

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: process.env.NODE_ENV !== 'production',
  historyApiFallback: true
}).listen(port, '0.0.0.0', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at port ' + port);
});
