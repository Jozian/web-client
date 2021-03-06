const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  devtool: isDevelopment ? 'inline-source-maps' : 'eval',
  watchDelay: 300,
  entry: isDevelopment ? [
    './src/index',
    'webpack-hot-middleware/client',
  ] : [
    './src/index',
  ],
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new ExtractTextPlugin('styles.css', {publicPath: '/static/'}),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: path.join(__dirname, 'src'),
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: isDevelopment ? ['react-hot', 'babel'] : ['babel'],
      include: path.join(__dirname, 'src'),
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&sourceMap&root=.&localIdentName=[path][name]---[local]---[hash:base64:5]'),
      include: path.join(__dirname, 'src'),
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "url-loader?limit=10000&minetype=application/font-woff",
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "file-loader",
    }],
  },
};
