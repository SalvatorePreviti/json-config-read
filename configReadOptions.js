const path = require('path')

const defaultOptions = {
  /**
   * The file extensions that are parseable.
   *
   * @type {Object.<string, boolean>?}
   */
  extensions: {
    '.js': false,
    '.json': true,
    '.hjson': true,
    '.jsonc': true
  },

  /**
   * True if directories can be read merging all files inside them
   * @type {boolean?}
   */
  mergeDirectories: true,

  /**
   * The root path to use. If unspecified, current directory is used.
   * @type {string?}
   */
  rootPath: undefined
}

function get(options = defaultOptions) {
  const result = { ...defaultOptions }

  if (options && options !== defaultOptions) {
    if (options.extensions !== undefined) {
      if (typeof options.extensions !== 'object' || Array.isArray(options.extensions)) {
        throw new TypeError('options.extensions must be an object')
      }
      options.extensions = { ...result.extensions, ...options.extensions }
    }
    if (options.rootPath !== undefined && options.rootPath !== null) {
      if (typeof options.rootPath !== 'string') {
        throw new TypeError('options.rootPath must be a string')
      }
      result.rootPath = options.rootPath
    }
    if (options.mergeDirectories !== undefined) {
      result.mergeDirectories = !!options.mergeDirectories
    }
  }

  if (!result.rootPath) {
    result.rootPath = process.cwd()
  }

  result.rootPath = path.normalize(result.rootPath)

  return result
}

module.exports.get = get
module.exports.default = defaultOptions
