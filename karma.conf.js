// Karma configuration
// Generated on Tue May 09 2017 14:48:57 GMT+0200 (CEST)

module.exports = function (config) {
	config.set({
		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['mocha', 'chai', 'karma-typescript'],

		// list of files / patterns to load in the browser
		files: [
			{ pattern: "src/main/**/*.ts" },
			{ pattern: "src/test/**/*.ts" }
		],

		// list of files to exclude
		exclude: [],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'src/main/**/*.ts': ['karma-typescript', 'coverage'],
			'src/test/**/*.ts': ['karma-typescript']
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress', 'coverage'],

		karmaTypescriptConfig: {
			compilerOptions: {
				target: 'es6'
			},
			bundlerOptions: {
				transforms: [require('karma-typescript-es6-transform')()]
			}
		},

		coverageReporter: {
			type: 'html',
			dir: 'build/coverage'
		},

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Chrome', 'Firefox'],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: 1
	});
};
