const ConfigReadOptions = require('../ConfigReadOptions')

describe('ConfigReadOptions.get', () => {
  it('works with undefined, null or empty object', () => {
    const expected = { ...ConfigReadOptions.default, rootPath: process.cwd() }
    expect(ConfigReadOptions.get(undefined)).toEqual(expected)
    expect(ConfigReadOptions.get(null)).toEqual(expected)
    expect(ConfigReadOptions.get({})).toEqual(expected)
    expect(ConfigReadOptions.get(ConfigReadOptions.default)).toEqual(expected)
  })

  it('returns always a different instance', () => {
    const a = ConfigReadOptions.get()
    const b = ConfigReadOptions.get()
    expect(a !== b).toBe(true)
    expect(a.extensions !== b.extensions).toBe(true)
  })

  it('merges and fixes extensions', () => {
    const a = ConfigReadOptions.get({
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
    expect(ConfigReadOptions.get({ allowDirectories: true }).allowDirectories).toBe(true)
    expect(ConfigReadOptions.get({ allowDirectories: false }).allowDirectories).toBe(false)
    expect(ConfigReadOptions.get({ allowDirectories: undefined }).allowDirectories).toBe(true)
  })
})
