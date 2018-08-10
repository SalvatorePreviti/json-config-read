const index = require('../index')
const configReadSync = require('../configReadSync')
const configReadAsync = require('../configReadAsync')

describe('index', () => {
  it('exports configReadAsync', () => {
    expect(index.configReadAsync).toBe(configReadAsync)
  })

  it('exports configReadSync', () => {
    expect(index.configReadSync).toBe(configReadSync)
  })
})
