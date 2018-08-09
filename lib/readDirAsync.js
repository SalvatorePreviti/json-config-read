const path = require('path')
const fs = require('fs')
const util = require('util')
const defaultOptions = require('./defaultOptions')
const makeOptions = require('./makeOptions')
const makeError = require('./makeError')
const readSingleAsync = require('./readSingleAsync')

const readdirAsync = util.promisify(fs.readdir)

async function readDirAsync(folderPath, options = defaultOptions) {
  if (typeof filePath !== 'string' || folderPath.length === 0) {
    throw new TypeError('Invalid folder path, must be a non empty string')
  }

  options = makeOptions(options)
  if (!path.isAbsolute(folderPath)) {
    folderPath = path.join(options.rootPath, folderPath)
  }
  folderPath = path.resolve(folderPath)

  const result = {}

  try {
    const files = await readdirAsync(folderPath)

    const promises = []
    for (const file of files) {
      if (!file.startsWith('.') && options.extensions.indexOf(path.extname(file) >= 0)) {
        promises.push(
          readSingleAsync(path.join(folderPath, file), options.rootPath)
            .then(parsed => {
              const key = path.basename(file, path.extname(file))
              if (typeof result[key] === 'object') {
                throw new Error(`Multiple files with key ${key}`)
              }
              result[key] = parsed
            })
            .catch(error => {
              if (error.code !== 'ENOENT') {
                throw makeError(error, folderPath, options.rootPath)
              }
            })
        )
      }
    }

    await Promise.all(promises)

    return result
  } catch (error) {
    throw makeError(error, folderPath, options.rootPath)
  }
}

module.exports = readDirAsync
