const path = require('path')

function resolvePath(configPath, options) {
  if (typeof configPath !== 'string') {
    throw new TypeError(`path must be a string but is "${typeof configPath}"`)
  }
  if (configPath.length === 0) {
    throw new TypeError('path cannot be an empty string')
  }
  if (!path.isAbsolute(configPath)) {
    return path.join(options.rootPath, configPath)
  }
  return path.resolve(configPath)
}

module.exports = resolvePath
