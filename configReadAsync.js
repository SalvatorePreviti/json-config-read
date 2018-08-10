const path = require('path')
const util = require('util')
const fs = require('fs')
const ConfigReadOptions = require('./ConfigReadOptions')
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
 * @param {ConfigReadOptions.default} [options=ConfigReadOptions] The options
 * @returns {Promise<*>} A promise that resolves the loaded data
 */
async function readConfigAsync(configPath, options = ConfigReadOptions.default) {
  options = ConfigReadOptions.get(options)
  configPath = resolvePath(configPath, options)

  try {
    const stat = await lstatAsync(configPath)

    if (stat.isFile()) {
      const ext = path.extname(configPath)
      if (!options.extensions[ext]) {
        throw new Error(`Invalid extension "${ext}"`)
      }
      return (await readFile.readSync(configPath)).data
    }

    if (!stat.isDirectory() || !options.allowDirectories) {
      const error = new Error(`Path not found or not readable`)
      error.errno = -2
      error.code = 'ENOENT'
      throw error
    }

    const data = []
    const promises = []
    for (const file of await readdirAsync(configPath)) {
      const ext = path.extname(file)
      if (options.extensions[ext] && !file.startsWith('.')) {
        const f = path.join(configPath, file)
        promises.push(
          lstatAsync(f).then(async stats => {
            if (stats.isFile()) {
              data.push(await readFile.readAsync(f))
            }
          })
        )
      }
    }

    await Promise.all(promises)

    return deepmergeConfig(data, options.rootPath)
  } catch (error) {
    throw makeError(error, configPath, options.rootPath)
  }
}

module.exports = readConfigAsync
