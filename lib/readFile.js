/* eslint global-require:0 */

const fs = require('fs')
const path = require('path')
const util = require('util')
const hjson = require('hjson')
const readFileAsync = util.promisify(fs.readFile)

function readJs(filePath) {
  filePath = require.resolve(filePath)
  const cache = require.cache[filePath]
  delete require.cache[filePath]
  let loaded
  try {
    // eslint-disable-next-line global-require
    loaded = require(filePath)
  } finally {
    if (cache !== undefined) {
      require.cache[filePath] = cache
    } else if (require.cache[filePath] !== undefined) {
      delete require.cache[filePath]
    }
  }
  return JSON.parse(JSON.stringify(loaded))
}

async function readAsync(filePath) {
  const ext = path.extname(filePath)
  if (ext === '.js') {
    return readJs(filePath)
  }

  const content = await readFileAsync(filePath, { encoding: 'utf8' })
  return {
    path: filePath,
    data: hjson.parse(content.toString('utf8'))
  }
}

function readSync(filePath) {
  const ext = path.extname(filePath)
  if (ext === '.js') {
    return readJs(filePath)
  }

  const content = fs.readFileSync(filePath, { encoding: 'utf8' })
  return {
    path: filePath,
    data: hjson.parse(content.toString('utf8'))
  }
}

module.exports.readAsync = readAsync
module.exports.readSync = readSync
