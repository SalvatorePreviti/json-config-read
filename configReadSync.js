const path = require('path')
const fs = require('fs')
const configReadOptions = require('./configReadOptions')
const resolvePath = require('./lib/resolvePath')
const readFile = require('./lib/readFile')
const makeError = require('./lib/makeError')
const deepmergeConfig = require('./lib/deepmergeConfig')

/**
 * Reads a configuration file or directory synchronously.
 *
 * @param {string} configPath Path of the file or directory to load
 * @param {optionsModule.default} [options=configReadOptions.default] The options
 * @returns {*} The loaded data
 */
function readConfigSync(configPath, options = configReadOptions.default) {
  options = configReadOptions.get(options)
  configPath = resolvePath(configPath, options)

  try {
    const stat = fs.lstatSync(configPath)

    if (stat.isFile()) {
      return readFile.readAsync(configPath)
    }

    if (!stat.isDirectory()) {
      const error = new Error(`Path not found or not readable`)
      error.errno = -2
      error.code = 'ENOENT'
      throw error
    }

    const data = []
    for (const file of fs.readdirSync(configPath)) {
      const ext = path.extname(file)
      if (options.extensions[ext]) {
        data.push(readFile.readAsync(path.join(configPath, file)))
      }
    }

    return deepmergeConfig(data, options.rootPath)
  } catch (error) {
    throw makeError(error, configPath, options.rootPath)
  }
}

module.exports = readConfigSync
