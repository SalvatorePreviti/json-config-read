const path = require('path')

/**
 * Read options
 *
 * @class
 */
class ConfigReadOptions {
  constructor() {
    /**
     * True if directories can be read merging all files inside them
     * @type {boolean?}
     */
    this.allowDirectories = true

    /**
     * The root path to use. If unspecified, current directory is used.
     * @type {string?}
     */
    this.rootPath = undefined

    /**
     *
     * The file extensions that are parseable.
     *
     * @type {Object.<string, boolean>?}
     */
    this.extensions = {
      '.js': false,
      '.json': true,
      '.hjson': true,
      '.jsonc': true
    }
  }

  /**
   * Sanitize the given option merging with default options
   *
   * @static
   * @param {ConfigReadOptions?} options The options to merge.
   * @returns {ConfigReadOptions} Merged and sanitized options.
   */
  static get(options) {
    const defaultOptions = ConfigReadOptions.defaultOptions || new ConfigReadOptions()

    const extensions = {}
    for (const key of Object.keys(defaultOptions.extensions)) {
      const ext = key.startsWith('.') ? key : `.${key}`
      extensions[ext] = !!defaultOptions.extensions[key]
    }

    const result = new ConfigReadOptions()
    Object.assign(result, defaultOptions)
    result.extensions = extensions

    if (options === null || options === undefined) {
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
}

/**
 * The default options.
 * @static
 * @type {ConfigReadOptions}
 */
ConfigReadOptions.default = new ConfigReadOptions()

module.exports = ConfigReadOptions
