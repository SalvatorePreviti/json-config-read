const index = require('../index')
const configReadSync = require('../configReadSync')
const configReadAsync = require('../configReadAsync')
const listConfigsSync = require('../listConfigsSync')
const listConfigsAsync = require('../listConfigsAsync')

describe('index', () => {
  it('exports configReadAsync', () => {
    expect(index.configReadAsync).toBe(configReadAsync)
  })

  it('exports configReadSync', () => {
    expect(index.configReadSync).toBe(configReadSync)
  })

  it('exports listConfigsAsync', () => {
    expect(index.listConfigsAsync).toBe(listConfigsAsync)
  })

  it('exports listConfigsSync', () => {
    expect(index.listConfigsSync).toBe(listConfigsSync)
  })
})
