const fetch = require('./util/fetch-wrapper');
const config = require('./util/config');
const qsEncode = require('./util/qs-encode');

module.exports = {
	all() {
		return fetch(`${config.baseUrl()}/api/dus`);
	},

	get(id) {
		return fetch(`${config.baseUrl()}/api/dus/${id}`);
	},

	getAllByNamespaceAndTdefName(namespace, tdefName) {
		return fetch(`${config.baseUrl()}/api/namespaces/${namespace}/tdefs/${tdefName}/dus`);
	},

	getAllByNamespaceAndTdefNameAndTdefVersion(namespace, tdefName, tdefVersion) {
		return fetch(`${config.baseUrl()}/api/namespaces/${namespace}/tdefs/${tdefName}/${tdefVersion}/dus`);
	},

	getSpecificByNamespaceAndTdefNameAndTdefVersion(namespace, tdefName, tdefVersion, filters) {
		return fetch(`${config.baseUrl()}/api/namespaces/${namespace}/tdefs/${tdefName}/${tdefVersion}/specific-dus?${qsEncode(filters)}`);
	},

	create(namespace, tdefName, tdefVersion, du) {
		return fetch(`${config.baseUrl()}/api/namespaces/${namespace}/tdefs/${tdefName}/${tdefVersion}/dus`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${config.token()}`
			},
			body: JSON.stringify(du)
		});
	},

	delete(id) {
		return fetch(`${config.baseUrl()}/api/dus/${id}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${config.token()}`
			}
		});
	},

	deleteByNamespaceAndTdefNameAndTdefVersionAndNameAndVersionAndPlatform(namespace, tdefName, tdefVersion, name, version, platform) {
		return fetch(`${config.baseUrl()}/api/namespaces/${namespace}/tdefs/${tdefName}/${tdefVersion}/dus/${name}/${version}/${platform}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${config.token()}`
			}
		});
	}
};
