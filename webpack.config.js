/* eslint-disable func-names */
'use strict';
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const env = require('yargs').argv.mode;
const target = require('yargs').argv.target;
const UglifyPlugin = webpack.optimize.UglifyJsPlugin;

const libraryName = 'openmrs-contrib-uicommons';
const fileName = 'openmrs-contrib-uicommons';

const plugins = [];
const nodeModules = {};

let outputFile;

/** Don't bundle dependencies for node module */
if (target === 'web') {
  outputFile = `${fileName}.bundle`;
}

/** Minify for production */
if (env === 'production') {
  plugins.push(new UglifyPlugin({
    output: {
      comments: false,
    },
    mangle: false,
    minimize: true,
    sourceMap: false,
    compress: {
        warnings: false
    }
  }));
  outputFile = `${outputFile}.min.js`;
} else if (env === 'dev') {
  outputFile = `${outputFile}.js`;
}

/** Inject version number */
plugins.push(new webpack.DefinePlugin({
  __OPENMRS_CONTRIB_UICOMMONS_VERSION__: JSON.stringify(require('./package.json').version),
}));

const config = {
  entry: {
	  app : `${__dirname}/openmrs-contrib-uicommons.js`
  },
  devtool: 'source-map',
  target,
  output: {
    path: `${__dirname}/lib`,
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    },{
	    test: /\.css$/,
	    loader: ['css', 'style']
	}, {
	    test: /\.(png|jpg|jpeg|gif|svg)$/,
	    loader: 'url'
	}, {
	    test: /\.html$/,
	    loader: 'html'
	},{
        test: /\.scss$/,
        loader: "style!css!sass?outputStyle=expanded&includePaths[]=" 
        		+ path.resolve(__dirname, "./node_modules/compass-mixins/lib")
      },
        {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url'},
        {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url'},
        {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url'},
        {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'url'},],
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js'],
  },
  plugins,
  externals: nodeModules,
};

module.exports = config;