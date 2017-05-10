export interface ITinyConf {
	get(key: string): any;
	set(value: any): void;
	set(key: string, value: any): void;
}

const config: ITinyConf = require('tiny-conf');
import btoa from './btoa';

// augment tiny-conf with some utility methods:
export function token() {
	const auth = config.get('user');
	if (!isTokenExpired()) {
		// there is a valid token
		return auth.access_token;
	}
	throw new Error(`Current user is not authenticated with ${baseUrl()}`);
}

export function isTokenExpired() {
	const auth = config.get('user');
	return !auth || !auth.access_token || !auth.expires_at || auth.expires_at <= Date.now();
}

export function baseUrl() {
	const conf = config.get('registry');
	return `${conf.ssl ? 'https':'http'}://${conf.host}:${conf.port}`;
}

export function clientAuthorization() {
	const clientId = config.get('registry.oauth.client_id');
	const clientSecret = config.get('registry.oauth.client_secret');
	return btoa(`${clientId}:${clientSecret}`);
}

export default config;
