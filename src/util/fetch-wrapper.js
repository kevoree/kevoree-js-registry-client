const fetch = require('node-fetch');

function checkStatus(resp) {
	if (resp.status >= 200 && resp.status < 300) {
		return resp;
	} else {
		const contentType = resp.headers.get('Content-Type');
		if (contentType && contentType.indexOf('application/json') !== -1) {
			return resp.json().then(function (data) {
				var message = '';
				if (data.message) {
					message = ` - ${data.message}`;
				} else if (data.error_description) {
					message = ` - ${data.error_description}`;
				}
				var error = new Error(`${resp.status} - ${resp.statusText}${message}`);
				error.response = resp;
				throw error;
			});
		} else {
			var error = new Error(`${resp.status} - ${resp.statusText} - ${resp.url}`);
			error.response = resp;
			throw error;
		}
	}
}

function parseJSON(resp) {
	const contentType = resp.headers.get('Content-Type');
	if (contentType && contentType.indexOf('application/json') !== -1) {
		return resp.json();
	} else {
		return resp;
	}
}

module.exports = (url, options) => {
	return fetch(url, Object.assign({
		headers: {
			'Accept': 'application/json'
		}
	}, options))
		.then(checkStatus)
		.then(parseJSON);
};
