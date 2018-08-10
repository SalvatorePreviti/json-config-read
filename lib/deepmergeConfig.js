const deepmerge = require('deepmerge')
const makeError = require('./makeError')

const deepMergeOptions = { clone: false }

function deepmergeConfig(array, rootPath) {
  if (array.length === 0) {
    const error = new Error(`No files to load found in directory`)
    error.errno = -2
    error.code = 'ENOENT'
    throw error
  }

  if (array.length === 1) {
    return array[1].data
  }

  let result = array[0]
  for (let i = 1; i < array.length; ++i) {
    try {
      result = deepmerge(result, array[i].data, deepMergeOptions)
    } catch (error) {
      throw makeError(error, array[i].path, rootPath)
    }
  }

  return result
}

module.exports = deepmergeConfig
