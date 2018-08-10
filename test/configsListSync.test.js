const path = require('path')
const configsListSync = require('../configsListSync')

describe('configsListSync', () => {
  it('is able to list all the configurations in a folder', () => {
    const list = configsListSync('test-data/list-configs', { rootPath: __dirname })
    const expected = ['a.json', 'b.jsonc', 'x'].map(x => path.join(__dirname, 'test-data/list-configs', x)).sort()
    expect(list).toEqual(expected)
  })
})
