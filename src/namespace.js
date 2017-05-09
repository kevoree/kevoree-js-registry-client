const fetch = require('./util/fetch-wrapper');
const config = require('./util/config');

module.exports = {
	all() {
		return fetch(`${config.baseUrl()}/api/namespaces`);
	},

	get(name) {
		return fetch(`${config.baseUrl()}/api/namespaces/${name}`);
	},

	create(name) {
		return fetch(`${config.baseUrl()}/api/namespaces`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${config.token()}`
			},
			body: JSON.stringify({ name: name })
		});
	},

	delete(name) {
		return fetch(`${config.baseUrl()}/api/namespaces/${name}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${config.token()}`
			}
		});
	},

	addMember(name, member) {
		return fetch(`${config.baseUrl()}/api/namespaces/${name}/members`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${config.token()}`
			},
			body: JSON.stringify({ name: member })
		});
	},

	removeMember(name, member) {
		return fetch(`${config.baseUrl()}/api/namespaces/${name}/members/${member}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${config.token()}`
			}
		});
	}
};
