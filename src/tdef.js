const fetch = require('./util/fetch-wrapper');
const config = require('./util/config');

module.exports = {
	all() {
		return fetch(`${config.baseUrl()}/api/tdefs`);
	},

	get(id) {
		return fetch(`${config.baseUrl()}/api/tdefs/${id}`);
	},

	getAllByNamespaceAndName(namespace, name) {
		return fetch(`${config.baseUrl()}/api/namespaces/${namespace}/tdefs/${name}`);
	},

	getLatestByNamespaceAndName(namespace, name) {
		return fetch(`${config.baseUrl()}/api/namespaces/${namespace}/tdefs/${name}/latest`);
	},

	getByNamespaceAndNameAndVersion(namespace, name, version) {
		return fetch(`${config.baseUrl()}/api/namespaces/${namespace}/tdefs/${name}/${version}`);
	},

	create(namespace, tdef) {
		return fetch(`${config.baseUrl()}/api/namespaces/${namespace}/tdefs`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${config.token()}`
			},
			body: JSON.stringify(tdef)
		});
	},

	delete(id) {
		return fetch(`${config.baseUrl()}/api/tdefs/${id}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${config.token()}`
			}
		});
	},

	deleteByNamespaceAndNameAndVersion(namespace, name, version) {
		return fetch(`${config.baseUrl()}/api/namespaces/${namespace}/tdefs/${name}/${version}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${config.token()}`
			}
		});
	}
};
