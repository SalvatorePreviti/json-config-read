const path = require('path')

function makeError(error, failedPath = null, rootPath = process.cwd()) {
  if (error === null || error === undefined) {
    error = 'operaton failed'
  }

  if (!(error instanceof Error)) {
    error = new Error(error)
    Error.captureStackTrace(error, makeError)
  }

  let msg = error.message
  if (typeof msg !== 'string') {
    msg = `${msg}`
  }

  if (typeof failedPath === 'string' && failedPath.length !== 0) {
    try {
      if (path.isAbsolute(failedPath)) {
        failedPath = path.relative(rootPath, failedPath)
      }
    } catch (e) {
      // ignore error
    }

    if (msg.indexOf(failedPath) <= 0) {
      msg = `${msg} processing "${failedPath}"`
    }

    if (!error.path) {
      Object.defineProperty(error, 'path', { value: failedPath, writable: true, configurable: true, enumerable: false })
    }

    error.message = msg
  }

  return error
}

module.exports = makeError
