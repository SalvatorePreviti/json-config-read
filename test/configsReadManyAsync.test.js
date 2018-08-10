const configsReadManyAsync = require('../configsReadManyAsync')

describe('configsReadManyAsync', () => {
  it('is able to read all the configurations in a folder', async () => {
    const configs = await configsReadManyAsync('test-data/list-configs', { rootPath: __dirname })
    expect(configs).toEqual({ a: { xx: 'yy' }, b: { zz: 'ww' }, x: { w: 1, k: 'kk' } })
  })
})
