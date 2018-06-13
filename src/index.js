const path = require('path')
const fs = require('fs')
const it = require('iter-tools/es2018')

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

function iterDuct ({ pipelineName, modulePath, configFile }) {
  modulePath = modulePath || getModuleDir()
  pipelineName = pipelineName || 'pipeline'
  configFile = configFile || 'iter-duct.config.js'
  const config = require(path.join(modulePath, configFile))
  const pipeline = Array.isArray(config) ? config : config[pipelineName]
  const iter = it.compose(pipeline.reverse())
  return iter
}

module.exports = iterDuct
