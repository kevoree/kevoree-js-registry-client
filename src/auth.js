const fetch = require('./util/fetch-wrapper');
const config = require('./util/config');
const qsEncode = require('./util/qs-encode');

function oauthToken(body) {
	return () => {
		body.client_id = config.get('registry.oauth.client_id');
		body.client_secret = config.get('registry.oauth.client_secret');

		return fetch(`${config.baseUrl()}/oauth/token`, {
			method: 'POST',
			body: qsEncode(body),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json',
				'Authorization': `Basic ${config.clientAuthorization()}`
			},
		}).then(function (data) {
			config.set('user.access_token', data.access_token);
			config.set('user.refresh_token', data.refresh_token);
			const expiredAt = new Date();
			expiredAt.setSeconds(expiredAt.getSeconds() + data.expires_in);
			config.set('user.expires_at', expiredAt.getTime());
		});
	};
}

function createLoginRequest() {
	const user = config.get('user');
	return oauthToken({
		username: user.login,
		password: user.password,
		grant_type: 'password',
		scope: 'read%20write'
	});
}

module.exports = {
	login() {
		return new Promise((resolve, reject) => {
			// if this does not throw => then we are already logged-in
			try {
				config.token();
				resolve();
			} catch (err) {
				reject(err);
			}
		}).catch(() => {
			if (config.isTokenExpired()) {
				// access_token expired
				return this.refresh()
					// if the refresh process failed => retry login
					.catch(createLoginRequest());
			} else {
				// no token at all
				return createLoginRequest()();
			}
		});
	},
	logout() {
		throw new Error('api.auth.logout() is not implemented yet');
	},
	refresh() {
		const refreshToken = config.get('user.refresh_token');
		if (refreshToken) {
			return oauthToken({
				grant_type: 'refresh_token',
				refresh_token: refreshToken,
				scope: 'read%20write'
			})();
		} else {
			return Promise.reject(new Error(`Invalid refresh_token: ${refreshToken}`));
		}
	}
};
