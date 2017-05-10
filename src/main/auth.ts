import fetch from './util/fetch-wrapper';
import config, {
	baseUrl, clientAuthorization, isTokenExpired, token
} from './util/config';
import qsEncode from './util/qs-encode';

interface AOuthToken {
	access_token: string;
	refresh_token: string;
	expires_in: number;
}

function oauthToken(body: {}) {
	return () => {
		return fetch<AOuthToken>(`${baseUrl()}/oauth/token`, {
			method: 'POST',
			body: qsEncode({
				client_id: config.get('registry.oauth.client_id'),
				client_secret: config.get('registry.oauth.client_secret'),
				...body
			}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json',
				'Authorization': `Basic ${clientAuthorization()}`
			},
		}).then((data: AOuthToken) => {
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

export default {
	login() {
		return new Promise((resolve, reject) => {
			// if this does not throw => then we are already logged-in
			try {
				token();
				resolve();
			} catch (err) {
				reject(err);
			}
		}).catch(() => {
			if (isTokenExpired()) {
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
