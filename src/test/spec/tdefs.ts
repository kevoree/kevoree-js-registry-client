import { assert } from 'chai';
import { auth, tdef } from '../../main';
import initConf from '../util/init-conf';

describe('TypeDefinitions', function() {
  this.slow(200);

  before('init conf', initConf);

  before('log user in', () => {
    return auth.login();
  });

  it('retrieve all tdefs', () => {
    return tdef.all()
      .then((tdefs) => {
        assert.equal(tdefs.length, 8);
      });
  });

  it('retrieve all tdefs by namespace and name', () => {
    return tdef.getAllByNamespaceAndName('kevoree', 'Ticker')
      .then((tdefs) => {
        assert.equal(tdefs.length, 3);
        tdefs.forEach((tdef) => assert.equal(tdef.name, 'Ticker'));
      });
  });

  it('retrieve latest tdef by namespace and name', () => {
    return tdef.getLatestByNamespaceAndName('kevoree', 'Ticker')
      .then((tdef) => {
        assert.ok(tdef.id);
        assert.equal(tdef.name, 'Ticker');
        assert.equal(tdef.version, 3);
        assert.equal(tdef.namespace, 'kevoree');
      });
  });

  it('retrieve a tdef by namespace, name and version', () => {
    return tdef.getByNamespaceAndNameAndVersion('kevoree', 'Ticker', 3)
      .then((tdef) => {
        assert.ok(tdef.id);
        assert.equal(tdef.name, 'Ticker');
        assert.equal(tdef.version, 3);
        assert.equal(tdef.namespace, 'kevoree');
      });
  });

  it('create a new tdef', () => {
    const newTdef = {
      name: 'Foo',
      version: 1,
      model: JSON.stringify({
        class: 'org.kevoree.Component@Foo',
        name: 'Foo',
        version: 1,
        potato: 'foo',
      }),
    };

    return tdef.create('kevoree', newTdef)
      .then((tdef) => {
        assert.ok(tdef.id);
        assert.equal(tdef.name, newTdef.name);
        assert.equal(tdef.version, newTdef.version);
        assert.equal(tdef.namespace, 'kevoree');
      });
  });

  it('delete a tdef by namespace, name and version', () => {
    return tdef.deleteByNamespaceAndNameAndVersion('kevoree', 'Foo', 1);
  });
});
