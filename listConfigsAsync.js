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
 * @param {string} folderPath Path of the folder that contains multiple configurations to list
 * @param {configReadOptions.default} [options=optionsModule.default] The options
 * @returns {Promise<string[]>} A promise that resolves a list of paths
 */
async function listConfigsAsync(folderPath, options = configReadOptions.default) {
  options = configReadOptions.get(options)
  folderPath = resolvePath(folderPath, options)

  try {
    for (const file of await readdirAsync(folderPath)) {
      const ext = path.extname(file)
      if (options.extensions[ext] && !file.startsWith('.')) {
        promises.push(readFile.readAsync(path.join(configPath, file)))
      }
    }

    return deepmergeConfig(await Promise.all(promises), options.rootPath)
  } catch (error) {
    throw makeError(error, configPath, options.rootPath)
  }
}

module.exports = readConfigAsync
