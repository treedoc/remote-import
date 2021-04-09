// import RemoteImport from '../RemoteImport';

// Follow test doesn't work
describe('RemoteImport', () => {
  test('Fresh Import', async () => {
    const RemoteImport = require('../../lib/RemoteImport');
    console.log(RemoteImport);
    require = require("esm")(module/*, options*/)
  //  RemoteImport.init({refreshDuration:10000});
    const _ = require("https://jspm.dev/lodash").default;
    console.log(`_=${JSON.stringify(_)}`);
    console.log(_.add(1,3));
  });
});
