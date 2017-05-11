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

describe('Namespaces', function () {
	this.slow(200);

	before('log user in', () => {
		return api.auth.login();
	});

	it('retrieve all namespaces', () => {
		return api.namespace.all()
			.then((namespaces) => {
				assert.equal(namespaces.length, 2);
			});
	});

	it('retrieve a namespace by name', () => {
		return api.namespace.get('kevoree')
			.then((namespace) => {
				assert.equal(namespace.name, 'kevoree');
				assert.equal(namespace.owner, 'kevoree');
			});
	});

	it('create a new namespace', () => {
		return api.namespace.create('newnamespace')
			.then((namespace) => {
				assert.equal(namespace.name, 'newnamespace');
				assert.equal(namespace.owner, 'kevoree');
			});
	});

	it('delete a namespace', () => {
		return api.namespace.delete('newnamespace');
	});

	it('add a member then delete it', () => {
		return api.namespace.addMember('kevoree', 'user')
			.then((namespace) => {
				assert.equal(namespace.name, 'kevoree');
				assert.deepEqual(namespace.members, ['kevoree', 'user']);
			});
	});

	it('delete a namespace member', () => {
		return api.namespace.removeMember('kevoree', 'user');
	});

	it('delete a namespace not owned should fail', () => {
		return api.namespace.delete('user')
			.catch(err => {
				assert.ok(err);
				assert.equal(err.statusCode, 401);
			});
	});
});
