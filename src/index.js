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


async function iterDuct({ pipelineName, configPath }) {
  configPath = configPath || getModuleDir()
  const cfg = await loadConfig(configPath)
  const pipelineConfig = getPipeLineConfig(cfg, pipelineName)
  const segmentInstances = createSegmentInstances(pipelineConfig, configPath)
  const iter = it.compose(segmentInstances.reverse());
  return iter
}

module.exports = iterDuct
