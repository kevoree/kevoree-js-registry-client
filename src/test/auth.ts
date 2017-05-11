import { assert } from 'chai';
// import { isTokenExpired, token } from '../main/util/config';
import { auth } from '../main';
import { IUser } from '../main/auth';
const conf = require('tiny-conf');

describe('Auth', function () {
	this.slow(200);

	before('set conf', () => {
		conf.set({
			registry: {
				host: 'localhost',
				port: 8080,
				ssl: false,
				oauth: {
					client_id: 'kevoree_registryapp',
					client_secret: 'kevoree_registryapp_secret'
				}
			},
			user: {
				login: 'kevoree',
				password: 'kevoree'
			}
		});
	});

	it('auth.login() should define access_token, refresh_token and expires_at', () => {
		return auth.login()
			.then(() => {
				const user: IUser = conf.get('user');
				assert.equal(user.login, 'kevoree');
				assert.equal(user.password, 'kevoree');
				assert.ok(user.access_token);
				assert.ok(user.refresh_token);
				assert.isAtLeast(user.expires_at!, Date.now());
			});
	});

	// it('isTokenExpired() should return false if valid', () => {
	// 	conf.set('user.access_token', 'foo');
	// 	conf.set('user.expires_at', Date.now() + 1000);
	// 	assert.isFalse(isTokenExpired());
	// });
});
