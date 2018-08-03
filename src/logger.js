const winston = require('winston')

function logger ({ loglevel, logfile }) {
  const transports = [
    new winston.transports.Console()
  ]

  if (logfile) {
    transports.push(new winston.transports.File({ filename: logfile }))
  }

  return winston.createLogger({
    level: loglevel,
    transports
  })
}

function setLogger ({ loglevel, logfile }) {
  global.iterDuctLogger = logger({ loglevel, logfile })
}

function replaceLogger (loggerObj) {
  global.iterDuctLogger = loggerObj
}

function getLogger () {
  if (!global.iterDuctLogger) {
    setLogger({ loglevel: 'info' })
  }
  return global.iterDuctLogger
}

module.exports = { setLogger, getLogger, replaceLogger }
