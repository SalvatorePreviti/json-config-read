const path = require('path')

const defaultOptions = require('./defaultOptions')

function makeOptions(options = defaultOptions) {
  if (typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('options must be an object')
  }

  options = { ...options, ...defaultOptions }
  if (!options.rootPath) {
    options.rootPath = path.cwd()
  }
  return options
}

module.exports = makeOptions
