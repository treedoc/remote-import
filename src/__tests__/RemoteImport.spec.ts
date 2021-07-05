// import RemoteImport from '../RemoteImport';

// Follow test doesn't work. ESM and jest can't work together
describe('RemoteImport', () => {
  test('Fresh Import', async () => {
    // require = require("esm")(module/*, options*/)
    const RemoteImport = require('../../lib/RemoteImport').default;
    console.log(RemoteImport);
    RemoteImport.init({refreshDuration:10000});
    const _ = require("https://jspm.dev/lodash");
    console.log(`_=${JSON.stringify(_)}`);
    console.log(_.add(1,3));
  });
});
