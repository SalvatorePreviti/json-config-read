const configReadOptions = require('../configReadOptions')

describe('configReadOptions.get', () => {
  it('works with undefined, null or empty object', () => {
    const expected = { ...configReadOptions.default, rootPath: process.cwd() }
    expect(configReadOptions.get(undefined)).toEqual(expected)
    expect(configReadOptions.get(null)).toEqual(expected)
    expect(configReadOptions.get({})).toEqual(expected)
    expect(configReadOptions.get(configReadOptions.default)).toEqual(expected)
  })

  it('returns always a different instance', () => {
    const a = configReadOptions.get()
    const b = configReadOptions.get()
    expect(a !== b).toBe(true)
    expect(a.extensions !== b.extensions).toBe(true)
  })

  it('merges and fixes extensions', () => {
    const a = configReadOptions.get({
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
    expect(configReadOptions.get({ allowDirectories: true }).allowDirectories).toBe(true)
    expect(configReadOptions.get({ allowDirectories: false }).allowDirectories).toBe(false)
    expect(configReadOptions.get({ allowDirectories: undefined }).allowDirectories).toBe(true)
  })
})
