const configsReadManySync = require('../configsReadManySync')

describe('configsReadManySync', () => {
  it('is able to read all the configurations in a folder', () => {
    const configs = configsReadManySync('test-data/list-configs', { rootPath: __dirname })
    expect(configs).toEqual({ a: { xx: 'yy' }, b: { zz: 'ww' }, x: { w: 1, k: 'kk' } })
  })
})
