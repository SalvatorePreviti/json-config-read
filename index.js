const ConfigReadOptions = require('./ConfigReadOptions')
const configReadSync = require('./configReadSync')
const configReadAsync = require('./configReadAsync')
const configsListAsync = require('./configsListAsync')
const configsListSync = require('./configsListSync')
const configsReadManyAsync = require('./configsReadManyAsync')
const configsReadManySync = require('./configsReadManySync')

module.exports = {
  get defaultOptions() {
    return ConfigReadOptions.default
  },

  set defaultOptions(value) {
    ConfigReadOptions.default = value
  },

  configReadAsync,
  configReadSync,
  configsListAsync,
  configsListSync,
  configsReadManyAsync,
  configsReadManySync
}
