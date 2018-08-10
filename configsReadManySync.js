const configReadSync = require('./configReadSync')
const ConfigReadOptions = require('./ConfigReadOptions')
const configsListSync = require('./configsListSync')

const path = require('path')
const makeError = require('./lib/makeError')

/**
 * Reads all the configurations contained in a folder to a map object
 * @param {string} folderPath Path of the folder that contains multiple configurations to load
 * @param {ConfigReadOptions.default} [options=ConfigReadOptions] The options
 * @returns {Object.<string, *>} A map of loaded configurations
 */
function configsReadManySync(folderPath, options = ConfigReadOptions.default) {
  options = new ConfigReadOptions(options)

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
