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
				assert.isNotNull(js);
				assert.equal(js!.version, filters.js);
				const java = dus.find(du => du.platform === 'java');
				assert.isNotNull(java);
				assert.equal(java!.version, '3.0.0');
				const dotnet = dus.find(du => du.platform === 'dotnet');
				assert.isNotNull(dotnet);
				assert.equal(dotnet!.version, '5.4.0-SNAPSHOT');
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

	it('retrieve all the latest dus for a namespace.Type/version', () => {
		return api.du.getLatests('kevoree', 'Ticker', 3)
			.then((dus) => {
				assert.equal(dus.length, 3);
			});
	});

	it('retrieve the latest du targetting "js" for kevoree.Ticker/3', () => {
		return api.du.getLatestByPlatform('kevoree', 'Ticker', 3, 'js')
			.then((du) => {
				assert.ok(du.id);
				assert.equal(du.name, 'kevoree-comp-ticker');
				assert.equal(du.version, '3.1.0');
				assert.equal(du.platform, 'js');
			});
	});

	it('retrieve the latest release du targetting "java" for kevoree.Ticker/3', () => {
		return api.du.getLatestReleaseByPlatform('kevoree', 'Ticker', 3, 'java')
			.then((du) => {
				assert.ok(du.id);
				assert.equal(du.name, 'org.kevoree.library.java.toys');
				assert.equal(du.version, '3.0.0');
				assert.equal(du.platform, 'java');
			});
	});
});
