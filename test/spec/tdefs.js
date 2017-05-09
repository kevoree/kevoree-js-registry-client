const assert = require('chai').assert;
const conf = require('tiny-conf');
const api = require('../../src');

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

describe('TypeDefinitions', function () {
	this.slow(200);

	before('log user in', () => {
		return api.auth.login();
	});

	it('retrieve all tdefs', () => {
		return api.tdef.all()
			.then((tdefs) => {
				assert.equal(tdefs.length, 17);
			});
	});

	it('retrieve all tdefs by namespace and name', () => {
		return api.tdef.getAllByNamespaceAndName('kevoree', 'Ticker')
			.then((tdefs) => {
				assert.equal(tdefs.length, 3);
				tdefs.forEach(tdef => assert.equal(tdef.name, 'Ticker'));
			});
	});

	it('retrieve latest tdef by namespace and name', () => {
		return api.tdef.getLatestByNamespaceAndName('kevoree', 'Ticker')
			.then((tdef) => {
				assert.ok(tdef.id);
				assert.equal(tdef.name, 'Ticker');
				assert.equal(tdef.version, 3);
				assert.equal(tdef.namespace, 'kevoree');
			});
	});

	it('retrieve a tdef by namespace, name and version', () => {
		return api.tdef.getByNamespaceAndNameAndVersion('kevoree', 'Ticker', 3)
			.then((tdef) => {
				assert.ok(tdef.id);
				assert.equal(tdef.name, 'Ticker');
				assert.equal(tdef.version, 3);
				assert.equal(tdef.namespace, 'kevoree');
			});
	});

	it('create a new tdef', () => {
		const newTdef = {
			name: 'Foo',
			version: 1,
			model: JSON.stringify({
				class: 'org.kevoree.Component@Foo',
				name: 'Foo',
				version: 1,
				potato: 'foo'
			})
		};

		return api.tdef.create('kevoree', newTdef)
			.then((tdef) => {
				assert.ok(tdef.id);
				assert.equal(tdef.name, newTdef.name);
				assert.equal(tdef.version, newTdef.version);
				assert.equal(tdef.namespace, 'kevoree');
			});
	});

	it('delete a tdef by namespace, name and version', () => {
		return api.tdef.deleteByNamespaceAndNameAndVersion('kevoree', 'Foo', 1);
	});
});
