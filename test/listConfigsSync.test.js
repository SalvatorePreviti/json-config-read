const path = require('path')
const listConfigsSync = require('../listConfigsSync')

describe('listConfigsSync', () => {
  it('is able to list all the configurations in a folder', () => {
    const list = listConfigsSync('test-data/list-configs', { rootPath: __dirname })
    const expected = ['a.json', 'b.jsonc', 'x'].map(x => path.join(__dirname, 'test-data/list-configs', x)).sort()
    expect(list).toEqual(expected)
  })
})
