import { assert } from 'chai';
import * as api from '../main';
const conf = require('tiny-conf');

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

describe('Account', function () {
	this.slow(200);

	before('log user in', () => {
		return api.auth.login();
	});

	it('retrieve account', () => {
		return api.account.get()
			.then((user) => {
				assert.ok(user.id);
				assert.equal(user.login, 'kevoree');
				assert.deepEqual(user.namespaces, ['kevoree']);
			});
	});
});
