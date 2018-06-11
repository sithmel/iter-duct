const path = require('path')
const fs = require('fs')
const it = require('iter-tools')
const loadConfig = require('./load-config')
const getPipeLineConfig = require('./get-pipeline-config')
const createSegmentInstances = require('./create-segment-instances')

function getModuleDir() {
  const pathFrags = process.cwd().split(path.sep)
  while (pathFrags.length) {
    const dirpath = path.sep + path.join(...pathFrags)
    if (fs.existsSync(path.join(dirpath, 'package.json'))) {
      return dirpath
    }
    pathFrags.pop()
  }
}

async function getConflabConfig(modulePath, pipelineName) {
  const configPath = path.join(modulePath, 'config')
  const cfg = await loadConfig(configPath)
  const pipelineConfig = getPipeLineConfig(cfg, pipelineName)
  return createSegmentInstances(pipelineConfig, modulePath)
}

async function iterDuct({ pipelineName, modulePath, configFile, conflab }) {
  modulePath = modulePath || getModuleDir()
  let segmentInstances
  if (conflab) {
    segmentInstances = await getConflabConfig(modulePath, pipelineName)
  } else {
    segmentInstances = require(path.join(modulePath, configFile))
  }
  const iter = it.compose(segmentInstances.reverse());
  return iter
}

module.exports = iterDuct
