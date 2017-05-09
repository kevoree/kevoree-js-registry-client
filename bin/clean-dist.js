const rimraf = require('rimraf');
const debug = require('debug')('bin:clean:dist');

rimraf('dist', () => {
	debug('dist folder deleted');
});
