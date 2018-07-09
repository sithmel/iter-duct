const path = require('path')
const fs = require('fs')
const { IterDuct } = require('./index')

function getModuleDir () {
  const pathFrags = process.cwd().split(path.sep)
  while (pathFrags.length) {
    const dirpath = path.sep + path.join(...pathFrags)
    if (fs.existsSync(path.join(dirpath, 'package.json'))) {
      return dirpath
    }
    pathFrags.pop()
  }
}

function iterDuct ({ pipelineName, modulePath, configFile, argv }) {
  modulePath = modulePath || getModuleDir()
  configFile = configFile || 'iter-duct.config.js'
  const config = require(path.join(modulePath, configFile))

  if (pipelineName && !config[pipelineName]) {
    throw new Error(`Pipeline ${pipelineName} is not defined: You can use: ${Object.keys(config).join(', ')}`)
  }

  let pipeline = pipelineName ? config[pipelineName] : config

  if (!Array.isArray(pipeline) && typeof pipeline !== 'function') {
    throw new Error(`Pipeline should be either an array or a function returning an array`)
  }
  const pipelineFunc = typeof pipeline === 'function' ? pipeline : () => pipeline

  return Promise.resolve()
    .then(() => pipelineFunc(argv))
    .then((p) => new IterDuct(p))
}

module.exports = iterDuct
