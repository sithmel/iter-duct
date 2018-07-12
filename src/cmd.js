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

function iterDuct ({ pipelineNameCfg, modulePath, configFile, argv }) {
  modulePath = modulePath || getModuleDir()
  configFile = configFile || 'iter-duct.config.js'
  let config
  const configPath = path.join(modulePath, configFile)
  try {
    config = require(configPath)
  } catch (e) {
    throw new Error(`The configuration is not valid ${configPath}`)
  }
  let pipelines = []
  if (pipelineNameCfg) {
    const pipelineNames = pipelineNameCfg.split(/[,\s]+/)
    for (const pipelineName of pipelineNames) {
      if (!config[pipelineName]) {
        throw new Error(`Pipeline ${pipelineName} is not defined: You can use: ${Object.keys(config).join(', ')}`)
      }
      pipelines.push(config[pipelineName])
    }
  } else {
    pipelines.push(config)
  }

  let pipelineFuncs = []

  for (const pipeline of pipelines) {
    if (!Array.isArray(pipeline) && typeof pipeline !== 'function') {
      throw new Error(`Pipeline should be either an array or a function returning an array`)
    }
    pipelineFuncs.push(typeof pipeline === 'function' ? pipeline : () => pipeline)
  }
  return Promise.all(pipelineFuncs.map((pipelineFunc) => pipelineFunc(argv)))
    .then((p) => new IterDuct(p))
}

module.exports = iterDuct
