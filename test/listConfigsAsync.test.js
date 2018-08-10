const path = require('path')
const listConfigsAsync = require('../listConfigsAsync')

describe('listConfigsAsync', () => {
  it('is able to list all the configurations in a folder', async () => {
    const list = await listConfigsAsync('test-data/list-configs', { rootPath: __dirname })
    const expected = ['a.json', 'b.jsonc', 'x'].map(x => path.join(__dirname, 'test-data/list-configs', x)).sort()
    expect(list).toEqual(expected)
  })
})
