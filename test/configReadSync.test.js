const configReadSync = require('../configReadSync')
const path = require('path')
const simpleJson = require('./test-data/simpleJson.json')

describe('configReadSync', () => {
  it('throws with invalid path', () => {
    expect(() => configReadSync(undefined)).toThrow(TypeError)
    expect(() => configReadSync(null)).toThrow(TypeError)
    expect(() => configReadSync('')).toThrow(TypeError)
  })

  describe('single files', () => {
    it('is able to parse a single JSON file', () => {
      const f = path.join(__dirname, 'test-data/simpleJson.json')
      expect(configReadSync(f)).toEqual(simpleJson)
    })

    it('is able to parse a single JSON file, with rootPath', () => {
      expect(configReadSync('test-data/simpleJson.json', { rootPath: __dirname })).toEqual(simpleJson)
    })

    it('is able to parse json with comments', () => {
      expect(configReadSync('test-data/jsonc.jsonc', { rootPath: __dirname })).toEqual({
        hello: 'world',
        number: 10,
        obj: {
          a: 1,
          b: 2,
          c: 3
        }
      })
    })

    it('throws if extension is disabled', () => {
      try {
        configReadSync('test-data/simpleJson.json', { rootPath: __dirname, extensions: { json: false } })
        throw new Error('expected to throw')
      } catch (error) {
        expect(error.message).toEqual('Invalid extension ".json" (path "test-data/simpleJson.json")')
        expect(error.path).toEqual('test-data/simpleJson.json')
      }
    })

    it('allow reading js files', () => {
      const data = configReadSync('test-data/js.js', { rootPath: __dirname, extensions: { js: true } })
      expect(data).toEqual({
        js: true,
        obj: {
          x: 'x',
          y: 'y'
        }
      })
    })
  })

  describe('directories', () => {
    it('throws if passed an empty directory', () => {
      try {
        configReadSync('test-data/empty-dir', { rootPath: __dirname })
        throw new Error('expected to throw')
      } catch (error) {
        expect(error.message).toEqual('No files to load in folder (path "test-data/empty-dir")')
        expect(error.path).toEqual('test-data/empty-dir')
        expect(error.code).toEqual('ENOENT')
      }
    })

    it('loads all json files', () => {
      const data = configReadSync('test-data', { rootPath: __dirname })
      expect(data).toEqual({
        hello: 'world',
        number: 10,
        obj: { d: 10, e: 20, f: 30, a: 1, b: 2, c: 3 }
      })
    })

    it('loads also js files', () => {
      const data = configReadSync('test-data', { rootPath: __dirname, extensions: { js: true } })
      expect(data).toEqual({
        hello: 'world',
        number: 10,
        obj: { d: 10, e: 20, f: 30, x: 'x', y: 'y', a: 1, b: 2, c: 3 },
        js: true
      })
    })
  })
})
