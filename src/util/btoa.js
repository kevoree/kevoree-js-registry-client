function btoa(binary) {
	return new Buffer(binary).toString('base64');
}

module.exports = btoa;
