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

export interface IUser {
	login: string;
	password: string;
	access_token?: string;
	refresh_token?: string;
	expires_at?: number;
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
			const user: IUser = config.get('user');
			const expiredAt = new Date();
			expiredAt.setSeconds(expiredAt.getSeconds() + data.expires_in);
			user.access_token = data.access_token;
			user.refresh_token = data.refresh_token;
			user.expires_at = expiredAt.getTime();
		});
	};
}

function createLoginRequest() {
	const user: IUser = config.get('user');
	if (user) {
		return oauthToken({
			username: user.login,
			password: user.password,
			grant_type: 'password',
			scope: 'read%20write'
		});
	} else {
		return () => {
			return Promise.reject(new Error('Unable to find "user" in local config'))
		};
	}
}

export default {
	login() {
		return Promise.resolve()
			.then(() => {
				token();
				if (isTokenExpired()) {
					// access_token expired
					return this.refresh()
						// if the refresh process failed => retry login
						.catch(createLoginRequest());
				} else {
					// user is logged-in
					return;
				}
			})
			.catch(createLoginRequest());
	},
	logout() {
		throw new Error('api.auth.logout() is not implemented yet');
	},
	refresh() {
		const user: IUser = config.get('user');
		if (user) {
			if (user.refresh_token) {
				return oauthToken({
					grant_type: 'refresh_token',
					refresh_token: user.refresh_token,
					scope: 'read%20write'
				})();
			} else {
				return Promise.reject(new Error(`Invalid refresh_token: ${user.refresh_token}`));
			}
		} else {
			return Promise.reject(new Error(`Unable to find "user" in local config`));
		}
	},
	getToken() {
		return token();
	},
	isTokenExpired() {
		return isTokenExpired();
	}
};
