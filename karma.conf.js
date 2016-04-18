
var path = require('path');

module.exports = function (config) {
	  var webpackConfig = {
			  entry: {},
			  devtool: 'inline-source-map',
			  module: {
			    loaders: [{
				    test: /\.jsx?$/,
				    loader: 'babel-loader',
				    exclude: /node_modules/,
				    query: {
				        presets: ['es2015']
			    }
			    },{
				    test: /\.(png|jpg|jpeg|gif|svg)$/,
				    loader: 'url'
				}, {
				    test: /\.html$/,
				    loader: 'raw'
				}],
			  },
			  resolve: {
			    root: path.resolve('./src'),
			    extensions: ['', '.js'],
			  },
			};
  var configuration = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      './test.webpack.config.js'
    ],
    
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    	'./test.webpack.config.js': ['webpack', 'sourcemap']
    },
    
    webpackMiddleware: {
        noInfo: true
    },
    
    webpack: webpackConfig,
    
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Which plugins to enable
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require("karma-webpack"),
      require('karma-sourcemap-loader'),
      require('karma-coverage')
    ],
    
    junitReporter: {
        outputFile: 'test_out/unit.xml',
        suite: 'unit'
      },

     customLaunchers: {
        Chrome_travis_ci: {
          base: 'Chrome',
          flags: ['--no-sandbox']
        }
      },


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,    
  }
  
  config.set(configuration);
};