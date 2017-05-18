import { assert } from 'chai';
import { auth, IConfigUser } from '../../main';
import initConf from '../util/init-conf';
const conf = require('tiny-conf');

describe('Auth', function() {
  this.slow(200);

  before('init conf', initConf);

  it('auth.login() should define access_token, refresh_token and expires_at', () => {
    return auth.login()
      .then(() => {
        const user: IConfigUser = conf.get('user');
        assert.equal(user.login, 'kevoree');
        assert.equal(user.password, 'kevoree');
        assert.ok(user.access_token);
        assert.ok(user.refresh_token);
        assert.isAtLeast(user.expires_at!, Date.now());
      });
  });
});
