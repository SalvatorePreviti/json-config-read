const path = require('path')

/**
 * Config read options type
 *
 * @class
 */
class ConfigReadOptions {
  /**
   * Creates an instance of ConfigReadOptions.
   *
   * @param {Partial<ConfigReadOptions>|undefined|null} [options=null] The options to merge,
   */
  constructor(options = null) {
    if (!options) {
      options = ConfigReadOptions.default
    }

    if (!options) {
      /**
       * True if directories can be read merging all files inside them
       * @type {boolean}
       */
      this.allowDirectories = true

      /**
       * The root path to use. If unspecified, current directory is used.
       * @type {string}
       */
      this.rootPath = undefined

      /**
       *
       * The file extensions that are parseable.
       *
       * @type {Object.<string, boolean>}
       */
      this.extensions = {
        '.js': false,
        '.json': true,
        '.hjson': true,
        '.jsonc': true
      }
    } else {
      const defaultOptions = ConfigReadOptions.default || new ConfigReadOptions()

      const extensions = {}
      for (const key of Object.keys(defaultOptions.extensions)) {
        const ext = key.startsWith('.') ? key : `.${key}`
        extensions[ext] = !!defaultOptions.extensions[key]
      }

      Object.assign(this, defaultOptions)
      this.extensions = extensions

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
          this.rootPath = options.rootPath
        }
        if (options.allowDirectories !== undefined) {
          this.allowDirectories = !!options.allowDirectories
        }
      }
    }

    if (!this.rootPath) {
      this.rootPath = process.cwd()
    }

    this.rootPath = path.normalize(this.rootPath)
  }
}

/**
 * The default options.
 *
 * @static
 * @type {Partial<ConfigReadOptions>}
 */
ConfigReadOptions.default = new ConfigReadOptions()

module.exports = ConfigReadOptions
