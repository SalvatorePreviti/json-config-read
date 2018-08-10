const ConfigReadOptions = require('../ConfigReadOptions')

describe('ConfigReadOptions', () => {
  it('works with undefined, null or empty object', () => {
    const expected = { ...ConfigReadOptions.default, rootPath: process.cwd() }
    expect(new ConfigReadOptions(undefined)).toEqual(expected)
    expect(new ConfigReadOptions(null)).toEqual(expected)
    expect(new ConfigReadOptions({})).toEqual(expected)
    expect(new ConfigReadOptions(ConfigReadOptions.default)).toEqual(expected)
  })

  it('returns always a different instance', () => {
    const a = new ConfigReadOptions()
    const b = new ConfigReadOptions()
    expect(a !== b).toBe(true)
    expect(a.extensions !== b.extensions).toBe(true)
  })

  it('merges and fixes extensions', () => {
    const a = new ConfigReadOptions({
      extensions: {
        xxx: true,
        yyy: false,
        js: true,
        '.jsonc': false
      }
    })
    expect(a.extensions).toEqual({
      '.json': true,
      '.hjson': true,
      '.jsonc': false,
      '.xxx': true,
      '.yyy': false,
      '.js': true
    })
  })

  it('updates allowDirectories', () => {
    expect(new ConfigReadOptions({ allowDirectories: true }).allowDirectories).toBe(true)
    expect(new ConfigReadOptions({ allowDirectories: false }).allowDirectories).toBe(false)
    expect(new ConfigReadOptions({ allowDirectories: undefined }).allowDirectories).toBe(true)
  })
})
