const util = require('util')
const fs = require('fs')
const path = require('path')
const deepmerge = require('deepmerge')
const hjson = require('hjson')
const makeError = require('./makeError')
const makeOptions = require('./makeOptions')
const defaultOptions = require('./defaultOptions')

const lstatAsync = util.promisify(fs.lstat)
const readdirAsync = util.promisify(fs.readdir)
const readFileAsync = util.promisify(fs.readFile)

function requireWithoutCache(filePath) {
  const cache = require.cache[filePath]
  delete require.cache[filePath]

  // eslint-disable-next-line global-require
  const targetModule = require(filePath)

  require.cache[filePath] = cache
  return targetModule
}

async function parseSingleFileAsync(filePath, options = defaultOptions) {
  if (typeof filePath !== 'string' || filePath.length === 0) {
    throw new TypeError('Invalid file path, must be a non empty string')
  }

  try {
    if (filePath.endsWith('.js')) {
      const loaded = requireWithoutCache(filePath)
      if (loaded === null || loaded === undefined) {
        return loaded
      }
      return JSON.parse(JSON.stringify(loaded))
    }

    const content = await readFileAsync(filePath, { encoding: 'utf8' })
    return hjson.parse(content.toString('utf8'))
  } catch (error) {
    throw makeError(error, filePath, options.rootPath)
  }
}

async function readSingleAsync(folderPath, options = defaultOptions) {
  if (typeof folderPath !== 'string' || folderPath.length === 0) {
    throw new TypeError('Invalid folder path, must be a non empty string')
  }

  options = makeOptions(options)
  if (!path.isAbsolute(folderPath)) {
    folderPath = path.join(options.rootPath, folderPath)
  }
  folderPath = path.resolve(folderPath)

  try {
    const folderStats = await lstatAsync(folderPath)
    if (folderStats.isFile()) {
      return parseSingleFileAsync(folderPath, options.rootPath)
    }

    if (!folderStats.isDirectory()) {
      const error = new Error(`File not found or not readable`)
      error.errno = -2
      error.code = 'ENOENT'
      throw error
    }

    if (!options.mergeDirectory) {
      if (options.throwIfNotFound) {
        throw new Error('File not found')
      }
      return undefined
    }

    const files = await readdirAsync(folderPath)
    files.sort()

    const promises = []
    for (const file of files) {
      if (!file.startsWith('.') && options.extensions.indexOf(path.extname(file) >= 0)) {
        promises.push(parseSingleFileAsync(path.join(folderPath, file), options.rootPath))
      }
    }

    if (promises.length === 0) {
      const error = new Error(`No parseable found in directory`)
      error.errno = -2
      error.code = 'ENOENT'
      throw error
    }

    const array = await Promise.all(promises)

    if (array.length === 1) {
      return array[0]
    }

    let result = array[0]
    const deepMergeOptions = { clone: false }
    for (let i = 1; i < array.length; ++i) {
      try {
        result = deepmerge(result, array[i], deepMergeOptions)
      } catch (error) {}
    }

    return result
  } catch (error) {
    throw makeError(error, folderPath, options.rootPath)
  }
}

module.exports = readSingleAsync
