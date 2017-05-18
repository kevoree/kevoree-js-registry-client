import { assert } from 'chai';
import { auth, account } from '../../main';
import initConf from '../util/init-conf';

describe('Account', function () {
	this.slow(200);

	before('init conf', initConf);

	before('log user in', () => {
		return auth.login();
	});

	it('retrieve account', () => {
		return account.get()
			.then((user) => {
				assert.ok(user.id);
				assert.equal(user.login, 'kevoree');
				assert.deepEqual(user.namespaces, ['kevoree']);
			});
	});
});
