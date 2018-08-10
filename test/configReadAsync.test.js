const configReadAsync = require('../configReadAsync')
const path = require('path')
const simpleJson = require('./test-data/simpleJson.json')

describe('await configReadAsync', () => {
  describe('single files', async () => {
    it('is able to parse a single JSON file', async () => {
      const f = path.join(__dirname, 'test-data/simpleJson.json')
      expect(await configReadAsync(f)).toEqual(simpleJson)
    })

    it('is able to parse a single JSON file, with rootPath', async () => {
      expect(await configReadAsync('test-data/simpleJson.json', { rootPath: __dirname })).toEqual(simpleJson)
    })

    it('is able to parse json with comments', async () => {
      expect(await configReadAsync('test-data/jsonc.jsonc', { rootPath: __dirname })).toEqual({
        hello: 'world',
        number: 10,
        obj: {
          a: 1,
          b: 2,
          c: 3
        }
      })
    })

    it('throws if extension is disabled', async () => {
      try {
        await configReadAsync('test-data/simpleJson.json', { rootPath: __dirname, extensions: { json: false } })
        throw new Error('expected to throw')
      } catch (error) {
        expect(error.message).toEqual('Invalid extension ".json" (path "test-data/simpleJson.json")')
        expect(error.path).toEqual('test-data/simpleJson.json')
      }
    })

    it('allow reading js files', async () => {
      const data = await configReadAsync('test-data/js.js', { rootPath: __dirname, extensions: { js: true } })
      expect(data).toEqual({
        js: true,
        obj: {
          x: 'x',
          y: 'y'
        }
      })
    })
  })

  describe('directories', async () => {
    it('throws if passed an empty directory', async () => {
      try {
        await configReadAsync('test-data/empty-dir', { rootPath: __dirname })
        throw new Error('expected to throw')
      } catch (error) {
        expect(error.message).toEqual('No files to load in folder (path "test-data/empty-dir")')
        expect(error.path).toEqual('test-data/empty-dir')
        expect(error.code).toEqual('ENOENT')
      }
    })

    it('loads all json files', async () => {
      const data = await configReadAsync('test-data', { rootPath: __dirname })
      expect(data).toEqual({
        hello: 'world',
        number: 10,
        obj: { d: 10, e: 20, f: 30, a: 1, b: 2, c: 3 }
      })
    })

    it('loads also js files', async () => {
      const data = await configReadAsync('test-data', { rootPath: __dirname, extensions: { js: true } })
      expect(data).toEqual({
        hello: 'world',
        number: 10,
        obj: { d: 10, e: 20, f: 30, x: 'x', y: 'y', a: 1, b: 2, c: 3 },
        js: true
      })
    })
  })
})
