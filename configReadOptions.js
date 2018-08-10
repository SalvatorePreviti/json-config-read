const path = require('path')

/** @class */
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
  allowDirectories: true,

  /**
   * The root path to use. If unspecified, current directory is used.
   * @type {string?}
   */
  rootPath: undefined
}

/**
 * Sanitize the given option merging with default options
 *
 * @param {defaultOptions} [options=defaultOptions] The options to merge.
 * @returns {defaultOptions} Merged and sanitized options.
 */
function get(options = defaultOptions) {
  const extensions = {}
  for (const key of Object.keys(defaultOptions.extensions)) {
    const ext = key.startsWith('.') ? key : `.${key}`
    extensions[ext] = !!defaultOptions.extensions[key]
  }

  const result = { ...defaultOptions, extensions }

  if (options === null) {
    options = defaultOptions
  }

  if (typeof options !== 'object') {
    throw new TypeError(`options must be an object but is ${typeof options}`)
  }

  if (Array.isArray(options)) {
    throw new TypeError(`options must be an object but is an array`)
  }

  if (options && options.extensions !== undefined && options.extensions !== null) {
    if (typeof options.extensions !== 'object') {
      throw new TypeError(`options.extensions must be an object but is ${typeof options.extensions}`)
    }
    if (Array.isArray(options.extensions)) {
      throw new TypeError(`options.extensions must be an object but is an array`)
    }

    for (const key of Object.keys(options.extensions)) {
      const ext = key.startsWith('.') ? key : `.${key}`
      const v = !!options.extensions[key]
      if (v !== extensions[ext]) {
        extensions[ext] = v
      }
    }
  }

  if (options && options !== defaultOptions) {
    if (options.rootPath !== undefined && options.rootPath !== null) {
      if (typeof options.rootPath !== 'string') {
        throw new TypeError('options.rootPath must be a string')
      }
      result.rootPath = options.rootPath
    }
    if (options.allowDirectories !== undefined) {
      result.allowDirectories = !!options.allowDirectories
    }
  }

  if (!result.rootPath) {
    result.rootPath = process.cwd()
  }

  result.rootPath = path.normalize(result.rootPath)

  return result
}

module.exports = {
  defaultOptions,
  get
}
