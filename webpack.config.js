var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  devtool: isProduction ? 'eval' : 'inline-source-maps',
  entry: [
    './src/index',
  ],
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new ExtractTextPlugin('styles.css', {publicPath: '/static/'}),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: path.join(__dirname, 'src'),
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel'],
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
