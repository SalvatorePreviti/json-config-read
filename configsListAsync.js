const path = require('path')
const util = require('util')
const fs = require('fs')
const ConfigReadOptions = require('./ConfigReadOptions')
const resolvePath = require('./lib/resolvePath')
const makeError = require('./lib/makeError')

const lstatAsync = util.promisify(fs.lstat)
const readdirAsync = util.promisify(fs.readdir)

/**
 * Lists all configurations in a directory, asynchrounously.
 * @param {string} folderPath Path of the folder that contains multiple configurations to list
 * @param {ConfigReadOptions.default} [options=ConfigReadOptions] The options
 * @returns {Promise<string[]>} A promise that resolves a list of full paths
 */
async function configsListAsync(folderPath, options = ConfigReadOptions.default) {
  options = ConfigReadOptions.get(options)
  folderPath = resolvePath(folderPath, options)

  const result = []

  try {
    const promises = []
    for (const filename of await readdirAsync(folderPath)) {
      if (!filename.startsWith('.')) {
        const filepath = path.join(folderPath, filename)
        promises.push(
          lstatAsync(filepath).then(async stats => {
            if (stats.isFile()) {
              const ext = path.extname(filename)
              if (options.extensions[ext]) {
                result.push(filepath)
              }
            } else if (stats.isDirectory()) {
              const inner = await readdirAsync(filepath)
              for (const x of inner) {
                if (!x.startsWith('.')) {
                  const ext = path.extname(x)
                  if (options.extensions[ext]) {
                    result.push(filepath)
                    break
                  }
                }
              }
            }
          })
        )
      }
    }

    await Promise.all(promises)
    return result.sort()
  } catch (error) {
    throw makeError(error, folderPath, options.rootPath)
  }
}

module.exports = configsListAsync
