//test testindex.test.js


const {loadJSON} = require('../src/index.js');

//mock the fetch function
global.fetch = jset.fn(() => Promise.resolve({
ok: true,
json: () => Promise.resolve({key: 'value'}),
}));
 
