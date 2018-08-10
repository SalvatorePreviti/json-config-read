const path = require('path')
const fs = require('fs')
const ConfigReadOptions = require('./ConfigReadOptions')
const resolvePath = require('./lib/resolvePath')
const readFile = require('./lib/readFile')
const makeError = require('./lib/makeError')
const deepmergeConfig = require('./lib/deepmergeConfig')

/**
 * Reads a configuration file or directory synchronously.
 *
 * @param {string} configPath Path of the file or directory to load
 * @param {ConfigReadOptions} [options=ConfigReadOptions.default] The options
 * @returns {*} The loaded data
 */
function configReadSync(configPath, options = ConfigReadOptions.default) {
  options = new ConfigReadOptions(options)
  configPath = resolvePath(configPath, options)

  try {
    const stat = fs.lstatSync(configPath)

    if (stat.isFile()) {
      const ext = path.extname(configPath)
      if (!options.extensions[ext]) {
        throw new Error(`Invalid extension "${ext}"`)
      }
      return readFile.readSync(configPath).data
    }

    if (!stat.isDirectory() || !options.allowDirectories) {
      const error = new Error(`Path not found or not readable`)
      error.errno = -2
      error.code = 'ENOENT'
      throw error
    }

    const data = []
    for (const file of fs.readdirSync(configPath)) {
      const ext = path.extname(file)
      if (options.extensions[ext] && !file.startsWith('.')) {
        const f = path.join(configPath, file)
        const stats = fs.lstatSync(f)
        if (stats.isFile()) {
          data.push(readFile.readSync(f))
        }
      }
    }

    return deepmergeConfig(data, options.rootPath)
  } catch (error) {
    throw makeError(error, configPath, options.rootPath)
  }
}

module.exports = configReadSync
