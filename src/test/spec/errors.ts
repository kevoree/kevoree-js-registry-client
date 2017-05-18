import { assert } from 'chai';
import { auth } from '../../main';
import initConf from '../util/init-conf';
const conf = require('tiny-conf');

describe('Errors', function () {
	this.slow(200);

	before('init conf', () => {
		initConf();
		conf.set('registry.host', 'unknown-host.fail');
	});

	it('auth should fail when host is unreachable', () => {
		return auth.login()
			.catch((err) => {
				assert.ok(err);
			});
	});
});
