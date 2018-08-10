const deepmerge = require('deepmerge')
const makeError = require('./makeError')

const deepMergeOptions = { clone: false }

function deepmergeConfig(array, rootPath) {
  if (array.length === 0) {
    const error = new Error(`No files to load in folder`)
    error.errno = -2
    error.code = 'ENOENT'
    throw error
  }

  let result

  let i = 0
  while (i < array.length) {
    const v = array[i++].data
    if (v !== undefined) {
      if (v === null) {
        if (result === undefined) {
          result = null
        }
      } else {
        result = v
        break
      }
    }
  }

  for (; i < array.length; ++i) {
    const v = array[i].data
    if (v === undefined) {
      continue
    }

    if (v === null) {
      if (result === undefined) {
        result = null
      }
      continue
    }

    try {
      result = deepmerge(result, v, deepMergeOptions)
    } catch (error) {
      throw makeError(error, array[i].path, rootPath)
    }
  }

  return result
}

module.exports = deepmergeConfig
