function qsEncode(obj) {
	return Object.keys(obj).reduce((params, key, i) => {
		return params + (i > 0 ? '&':'') + key + '=' + obj[key];
	}, '');
}

module.exports = qsEncode;
