import { assert } from 'chai';
import { auth, du, IDeployUnit } from '../../main';
import initConf from '../util/init-conf';

describe('DeployUnits', function () {
	this.slow(200);

	before('init conf', initConf);

	before('log user in', () => {
		return auth.login();
	});

	it('retrieve all dus', () => {
		return du.all()
			.then((dus) => {
				assert.equal(dus.length, 17);
			});
	});

	it('retrieve all dus by namespace, name and version', () => {
		return du.getAllByNamespaceAndTdefNameAndTdefVersion('kevoree', 'Ticker', 3)
			.then((dus) => {
				assert.equal(dus.length, 6);
				dus.forEach(du => {
					assert.ok(du.id);
					assert.equal(du.tdefName, 'Ticker');
					assert.equal(du.namespace, 'kevoree');
				});
			});
	});

	it('retrieve a du by namespace, tdefName, tdefVersion, name, version and platform', () => {
		return du.getByNamespaceAndTdefNameAndTdefVersionAndNameAndVersionAndPlatform('kevoree', 'Ticker', 3, 'kevoree-comp-ticker', '3.1.0', 'js')
			.then((du) => {
				assert.ok(du.id);
				assert.ok(du.model);
				assert.equal(du.namespace, 'kevoree');
				assert.equal(du.tdefName, 'Ticker');
				assert.equal(du.tdefVersion, 3);
				assert.equal(du.name, 'kevoree-comp-ticker');
				assert.equal(du.version, '3.1.0');
				assert.equal(du.platform, 'js');
			});
	});

	it('retrieve specific dus', () => {
		const filters = {
			js: '3.1.0-alpha',
			dotnet: 'latest'
		};

		return du.getSpecificByNamespaceAndTdefNameAndTdefVersion('kevoree', 'Ticker', 3, filters)
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

	let createdDu: IDeployUnit;
	it('create a new du', () => {
		const newDu = {
			name: 'kevoree-comp-ticker',
			version: '5.5.1-alpha',
			platform: 'js',
			model: JSON.stringify({
				class: 'org.kevoree.DeployUnit@kevoree-comp-ticker',
				name: 'kevoree-comp-ticker',
				version: '5.5.1-alpha'
			})
		};

		return du.create('kevoree', 'Ticker', 3, newDu)
			.then((du) => {
				assert.ok(du.id);
				assert.equal(du.name, newDu.name);
				assert.equal(du.version, newDu.version);
				assert.equal(du.platform, newDu.platform);
				assert.equal(du.tdefName, 'Ticker');
				assert.equal(du.tdefVersion, 3);
				assert.equal(du.namespace, 'kevoree');
				createdDu = du;
			});
	});

	it('update newly created du', () => {
		createdDu.model = JSON.stringify({
			class: 'org.kevoree.DeployUnit@kevoree-comp-ticker',
			name: 'kevoree-comp-ticker',
			version: '5.5.1-alpha',
			another: 'thing in the model'
		});

		return du.update(createdDu)
			.then((du) => {
				assert.ok(du.id);
				assert.equal(du.namespace, createdDu.namespace);
				assert.equal(du.tdefName, createdDu.tdefName);
				assert.equal(du.tdefVersion, createdDu.tdefVersion);
				assert.equal(du.name, createdDu.name);
				assert.equal(du.version, createdDu.version);
				assert.equal(du.platform, createdDu.platform);
				assert.equal(du.model, createdDu.model);
			});
	});

	it('delete a du by namespace, tdefName, tdefVersion, name, version and platform', () => {
		return du.deleteByNamespaceAndTdefNameAndTdefVersionAndNameAndVersionAndPlatform('kevoree', 'Ticker', 3, 'kevoree-comp-ticker', '5.5.1-alpha', 'js');
	});

	it('retrieve all the latest dus for a namespace.Type/version', () => {
		return du.getLatests('kevoree', 'Ticker', 3)
			.then((dus) => {
				assert.equal(dus.length, 3);
			});
	});

	it('retrieve the latest du targetting "js" for kevoree.Ticker/3', () => {
		return du.getLatestByPlatform('kevoree', 'Ticker', 3, 'js')
			.then((du) => {
				assert.ok(du.id);
				assert.equal(du.name, 'kevoree-comp-ticker');
				assert.equal(du.version, '3.1.0');
				assert.equal(du.platform, 'js');
			});
	});

	it('retrieve the latest release du targetting "java" for kevoree.Ticker/3', () => {
		return du.getReleaseByPlatform('kevoree', 'Ticker', 3, 'java')
			.then((du) => {
				assert.ok(du.id);
				assert.equal(du.name, 'org.kevoree.library.java.toys');
				assert.equal(du.version, '3.0.0');
				assert.equal(du.platform, 'java');
			});
	});
});
