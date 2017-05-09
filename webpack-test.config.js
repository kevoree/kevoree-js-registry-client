const { resolve } = require('path');

const webpack = require('webpack');

const config = {
	devtool: 'source-map',
	entry: resolve('src', 'index.js'),
	output: {
		filename: 'bundle.js',
		path: resolve('dist'),
		publicPath: '/dist/'
	},
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	]
};

module.exports = config;
