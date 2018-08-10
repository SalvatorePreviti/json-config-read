const index = require('../index')
const configReadSync = require('../configReadSync')
const configReadAsync = require('../configReadAsync')
const configsListSync = require('../configsListSync')
const configsListAsync = require('../configsListAsync')
const configsReadManyAsync = require('../configsReadManyAsync')
const configsReadManySync = require('../configsReadManySync')

describe('index', () => {
  it('exports configReadAsync', () => {
    expect(index.configReadAsync).toBe(configReadAsync)
  })

  it('exports configReadSync', () => {
    expect(index.configReadSync).toBe(configReadSync)
  })

  it('exports configsListAsync', () => {
    expect(index.configsListAsync).toBe(configsListAsync)
  })

  it('exports configsListSync', () => {
    expect(index.configsListSync).toBe(configsListSync)
  })

  it('exports configsReadManyAsync', () => {
    expect(index.configsReadManyAsync).toBe(configsReadManyAsync)
  })

  it('exports configsReadManySync', () => {
    expect(index.configsReadManySync).toBe(configsReadManySync)
  })
})
