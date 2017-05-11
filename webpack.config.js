const { resolve } = require('path');

const webpack = require('webpack');

const config = {
	entry: resolve('build', 'main', 'index.js'),
	output: {
		filename: 'kevoree-registry-client.js',
		library: 'KevoreeRegistryClient',
		libraryTarget: 'umd',
		path: resolve('build', 'browser'),
		publicPath: '/build/browser/',
		pathinfo: true,
	},
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
		]
	},
	externals: {
		'./btoa': 'btoa',
		'node-fetch': 'fetch',
		'tiny-conf': 'TinyConf'
	},
	plugins: []
};

if (process.env.NODE_ENV !== 'production') {
	config.plugins.push(new webpack.HotModuleReplacementPlugin());
	config.devtool = 'source-map';
}

module.exports = config;
