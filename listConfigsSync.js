const path = require('path')
const fs = require('fs')
const configReadOptions = require('./configReadOptions')
const resolvePath = require('./lib/resolvePath')
const makeError = require('./lib/makeError')

/**
 * Lists all configurations in a directory, synchrounously.
 * @param {string} folderPath Path of the folder that contains multiple configurations to list
 * @param {configReadOptions.default} [options=optionsModule.default] The options
 * @returns {string[]} A list of all full paths of all configurations
 */
function listConfigsSync(folderPath, options = configReadOptions.default) {
  options = configReadOptions.get(options)
  folderPath = resolvePath(folderPath, options)

  const result = []

  try {
    for (const filename of fs.readdirSync(folderPath)) {
      if (!filename.startsWith('.')) {
        const filepath = path.join(folderPath, filename)
        const stats = fs.statSync(filepath)

        if (stats.isFile()) {
          const ext = path.extname(filename)
          if (options.extensions[ext]) {
            result.push(filepath)
          }
        } else if (stats.isDirectory()) {
          const inner = fs.readdirSync(filepath)
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
      }
    }

    return result
  } catch (error) {
    throw makeError(error, folderPath, options.rootPath)
  }
}

module.exports = listConfigsSync
