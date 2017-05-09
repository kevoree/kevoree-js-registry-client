const config = require('tiny-conf');
const btoa = require('./btoa');

function token() {
	const auth = config.get('user');
	if (!isTokenExpired()) {
		// there is a valid token
		return auth.access_token;
	}
	throw new Error(`Current user is not authenticated with ${config.baseUrl()}`);
}

function isTokenExpired() {
	const auth = config.get('user');
	return !auth || !auth.access_token || !auth.expires_at || auth.expires_at <= Date.now();
}

function baseUrl() {
	const conf = config.get('registry');
	return `${conf.ssl ? 'https':'http'}://${conf.host}:${conf.port}`;
}

function clientAuthorization() {
	const clientId = config.get('registry.oauth.client_id');
	const clientSecret = config.get('registry.oauth.client_secret');
	return btoa(`${clientId}:${clientSecret}`);
}

// by default export the config
module.exports = config;
// but extend the config with some utility methods
module.exports.token = token;
module.exports.baseUrl = baseUrl;
module.exports.clientAuthorization = clientAuthorization;
module.exports.isTokenExpired = isTokenExpired;
