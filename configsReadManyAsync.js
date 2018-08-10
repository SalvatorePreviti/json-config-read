const configReadAsync = require('./configReadAsync')
const ConfigReadOptions = require('./ConfigReadOptions')
const configsListAsync = require('./configsListAsync')

const path = require('path')
const makeError = require('./lib/makeError')

/**
 * Reads all the configurations contained in a folder to a map object
 * @param {string} folderPath Path of the folder that contains multiple configurations to load
 * @param {ConfigReadOptions.default} [options=ConfigReadOptions] The options
 * @returns {Promise<Object.<string, *>>} A promise that resolves a map of loaded configurations
 */
async function configsReadManyAsync(folderPath, options = ConfigReadOptions.default) {
  options = new ConfigReadOptions(options)

  try {
    const configPaths = await configsListAsync(folderPath, options)

    const promises = []
    for (const configPath of configPaths) {
      promises.push(
        configReadAsync(configPath).then(async data => {
          return { name: path.basename(configPath, path.extname(configPath)), data }
        })
      )
    }

    const all = await Promise.all(promises)
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

module.exports = configsReadManyAsync
