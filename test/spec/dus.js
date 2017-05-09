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

describe('DeployUnits', function () {
	this.slow(200);

	before('log user in', () => {
		return api.auth.login();
	});

	it('retrieve all dus', () => {
		return api.du.all()
			.then((dus) => {
				assert.equal(dus.length, 17);
			});
	});

	it('retrieve all dus by namespace, name and version', () => {
		return api.du.getAllByNamespaceAndTdefNameAndTdefVersion('kevoree', 'Ticker', 3)
			.then((dus) => {
				assert.equal(dus.length, 6);
				dus.forEach(du => {
					assert.ok(du.id);
					assert.equal(du.tdefName, 'Ticker');
					assert.equal(du.namespace, 'kevoree');
				});
			});
	});

	it('retrieve specific dus', () => {
		const filters = {
			js: '3.1.0-alpha',
			dotnet: 'latest'
		};

		return api.du.getSpecificByNamespaceAndTdefNameAndTdefVersion('kevoree', 'Ticker', 3, filters)
			.then((dus) => {
				assert.equal(dus.length, 3);
				const js = dus.find(du => du.platform === 'js');
				const java = dus.find(du => du.platform === 'java');
				const dotnet = dus.find(du => du.platform === 'dotnet');

				assert.equal(js.version, filters.js);
				assert.equal(java.version, '3.0.0');
				assert.equal(dotnet.version, '5.4.0-SNAPSHOT');
			});
	});

	it('create a new du', () => {
		const newDu = {
			name: 'kevoree-comp-ticker',
			version: '5.5.1',
			platform: 'js',
			model: JSON.stringify({
				class: 'org.kevoree.DeployUnit@kevoree-comp-ticker',
				name: 'kevoree-comp-ticker',
				version: '5.5.1'
			})
		};

		return api.du.create('kevoree', 'Ticker', 3, newDu)
			.then((du) => {
				assert.ok(du.id);
				assert.equal(du.name, newDu.name);
				assert.equal(du.version, newDu.version);
				assert.equal(du.platform, newDu.platform);
				assert.equal(du.tdefName, 'Ticker');
				assert.equal(du.tdefVersion, 3);
				assert.equal(du.namespace, 'kevoree');
			});
	});

	it('delete a du by namespace, tdefName, tdefVersion, name, version and platform', () => {
		return api.du.deleteByNamespaceAndTdefNameAndTdefVersionAndNameAndVersionAndPlatform('kevoree', 'Ticker', 3, 'kevoree-comp-ticker', '5.5.1', 'js');
	});
});
