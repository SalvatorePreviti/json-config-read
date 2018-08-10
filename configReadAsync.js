const path = require('path')
const util = require('util')
const fs = require('fs')
const configReadOptions = require('./configReadOptions')
const resolvePath = require('./lib/resolvePath')
const readFile = require('./lib/readFile')
const makeError = require('./lib/makeError')
const deepmergeConfig = require('./lib/deepmergeConfig')

const lstatAsync = util.promisify(fs.lstat)
const readdirAsync = util.promisify(fs.readdir)

/**
 * Reads a configuration file or directory asynchronously.
 *
 * @param {string} configPath Path of the file or directory to load
 * @param {configReadOptions.default} [options=optionsModule.default] The options
 * @returns {Promise<*>} A promise that resolves the loaded data
 */
async function readConfigAsync(configPath, options = configReadOptions.default) {
  options = configReadOptions.get(options)
  configPath = resolvePath(configPath, options)

  try {
    const stat = await lstatAsync(configPath)

    if (stat.isFile()) {
      return readFile.readAsync(configPath)
    }

    if (!stat.isDirectory()) {
      const error = new Error(`Path not found or not readable`)
      error.errno = -2
      error.code = 'ENOENT'
      throw error
    }

    const promises = []
    for (const file of await readdirAsync(configPath)) {
      const ext = path.extname(file)
      if (options.extensions[ext]) {
        promises.push(readFile.readAsync(path.join(configPath, file)))
      }
    }

    return deepmergeConfig(await Promise.all(promises), options.rootPath)
  } catch (error) {
    throw makeError(error, configPath, options.rootPath)
  }
}

module.exports = readConfigAsync
