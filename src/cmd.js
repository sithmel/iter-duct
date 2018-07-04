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
  pipelineName = pipelineName || 'pipeline'
  configFile = configFile || 'iter-duct.config.js'
  const config = require(path.join(modulePath, configFile))
  const pipeline = Array.isArray(config) || typeof config === 'function' ? config : config[pipelineName]
  const pipelineFunc = typeof pipeline === 'function' ? pipeline : () => pipeline

  return Promise.resolve()
    .then(() => pipelineFunc(argv))
    .then((p) => new IterDuct(p))
}

module.exports = iterDuct
