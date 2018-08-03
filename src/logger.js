const winston = require('winston')
const { combine, timestamp, printf } = winston.format

const myFormat = printf(obj => {
  const item = typeof obj.item === 'object' ? JSON.stringify(obj.item, undefined, 2) : obj.item
  return `${obj.timestamp} ${obj.level}: ${obj.message} ${obj.error ? obj.error.stack : ''} ${item}`
})

function logger ({ loglevel, logfile }) {
  const { createLogger, format } = winston
  const transports = [
    new winston.transports.Console()
  ]

  if (logfile) {
    transports.push(new winston.transports.File({ filename: logfile }))
  }

  return createLogger({
    format: combine(
      format.colorize(),
      timestamp(),
      myFormat
    ),
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
