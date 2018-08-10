const configReadSync = require('./configReadSync')
const configReadAsync = require('./configReadAsync')
const listConfigsAsync = require('./listConfigsAsync')
const listConfigsSync = require('./listConfigsSync')

module.exports.configReadSync = configReadSync
module.exports.configReadAsync = configReadAsync

module.exports.listConfigsAsync = listConfigsAsync
module.exports.listConfigsSync = listConfigsSync
