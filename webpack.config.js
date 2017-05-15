/* eslint-disable func-names */
'use strict';
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const env = require('yargs').argv.mode;
const target = require('yargs').argv.target;

const UglifyPlugin = webpack.optimize.UglifyJsPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin')

var nodeExternals = require('webpack-node-externals');

const libraryName = 'openmrs-contrib-uicommons';
const fileName = 'openmrs-contrib-uicommons';

const plugins = [];
const nodeModules = {};

let outputFile;
let outputDir;
let entry;

var configJson;
let appEntryPoint;
let localOwaFolder;

try{
	configJson = require('./config.json');
	appEntryPoint = configJson.APP_ENTRY_POINT;
	localOwaFolder = configJson.LOCAL_OWA_FOLDER;
} catch(err){
	appEntryPoint = "http://localhost:8080//openmrs//owa//openmrs-contrib-uicommons//index.html";
	localOwaFolder = `${__dirname}/dist/`;	
}

/** Don't bundle dependencies for node module */
if (target === 'web') {
  outputFile = `${fileName}.bundle`;
}

/** Minify for production */
if (env === 'production') {
	
  plugins.push(new UglifyPlugin({
    compress: {
        warnings: false
    }
  }));
  
  outputFile = `${outputFile}.min.js`;
  outputDir = `${__dirname}/lib`;
  entry = `${__dirname}/openmrs-contrib-uicommons.js`;
} else if (env === 'dev') {
  outputFile = `${outputFile}.js`;
  outputDir = `${__dirname}/dist`;
  entry = `${__dirname}/demo-app/app.module.js`;
  
  plugins.push(new HtmlWebpackPlugin({
	    template: './demo-app/app.html',
	    inject: 'body'
	}));
} else if (env === 'deploy'){
	outputFile = `${outputFile}.js`;
	  outputDir = `${localOwaFolder}${libraryName}`;
	  entry = `${__dirname}/demo-app/app.module.js`;
	  
	  plugins.push(new CopyWebpackPlugin([{
		    from: './demo-app/manifest.webapp'
		}]));
	  plugins.push(new HtmlWebpackPlugin({
		    template: './demo-app/app.html',
		    inject: 'body'
		}));
	  plugins.push(new BrowserSyncPlugin({
		    host: 'localhost',
		    port: 3000,
		    proxy: {
		    	target : appEntryPoint
		    }
	}));
}

/** Inject version number */
plugins.push(new webpack.DefinePlugin({
  __OPENMRS_CONTRIB_UICOMMONS_VERSION__: JSON.stringify(require('./package.json').version),
}));

const config = {
  entry: entry,
  devtool: 'source-map',
  target,
  output: {
    path: outputDir,
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
	    loader: 'style-loader!css-loader'
	}, {
	    test: /\.(png|jpg|jpeg|gif|svg)$/,
	    loaders: ['url', 
	              'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false']
	}, {
	    test: /\.html$/,
	    loader: 'html'
	}, {
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
  externals: [nodeExternals()],
};

module.exports = config;