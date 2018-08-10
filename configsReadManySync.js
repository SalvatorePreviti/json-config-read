const configReadSync = require('./configReadSync')
const configReadOptions = require('./configReadOptions')
const configsListSync = require('./configsListSync')

const path = require('path')
const makeError = require('./lib/makeError')

/**
 * Reads all the configurations contained in a folder to a map object
 * @param {string} folderPath Path of the folder that contains multiple configurations to load
 * @param {configReadOptions.default} [options=optionsModule.default] The options
 * @returns {Promise<Object.<string, *>>} A promise that resolves a map of loaded configurations
 */
function configsReadManySync(folderPath, options = configReadOptions.default) {
  options = configReadOptions.get(options)

  try {
    const configPaths = configsListSync(folderPath, options)

    const all = []
    for (const configPath of configPaths) {
      const data = configReadSync(configPath)
      all.push({ name: path.basename(configPath, path.extname(configPath)), data })
    }

    all.sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })

    const result = {}
    for (const item of all) {
      result[item.name] = item.data
    }

    return result
  } catch (error) {
    throw makeError(error, folderPath, options.rootPath)
  }
}

module.exports = configsReadManySync
