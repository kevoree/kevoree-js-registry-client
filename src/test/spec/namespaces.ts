import { assert } from 'chai';
import { auth, namespace } from '../../main';
import initConf from '../util/init-conf';

describe('Namespaces', function () {
	this.slow(200);

	before('init conf', initConf);

	before('log user in', () => {
		return auth.login();
	});

	it('retrieve all namespaces', () => {
		return namespace.all()
			.then((namespaces) => {
				assert.equal(namespaces.length, 2);
			});
	});

	it('retrieve a namespace by name', () => {
		return namespace.get('kevoree')
			.then((namespace) => {
				assert.equal(namespace.name, 'kevoree');
				assert.equal(namespace.owner, 'kevoree');
			});
	});

	it('create a new namespace', () => {
		return namespace.create('newnamespace')
			.then((namespace) => {
				assert.equal(namespace.name, 'newnamespace');
				assert.equal(namespace.owner, 'kevoree');
			});
	});

	it('delete a namespace', () => {
		return namespace.delete('newnamespace');
	});

	it('add a member then delete it', () => {
		return namespace.addMember('kevoree', 'user')
			.then((namespace) => {
				assert.equal(namespace.name, 'kevoree');
				assert.deepEqual(namespace.members, ['kevoree', 'user']);
			});
	});

	it('delete a namespace member', () => {
		return namespace.removeMember('kevoree', 'user');
	});

	it('delete a namespace not owned should fail', () => {
		return namespace.delete('user')
			.catch(err => {
				assert.ok(err);
				assert.equal(err.statusCode, 401);
			});
	});
});
