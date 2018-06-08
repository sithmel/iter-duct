const path = require('path')

function normaliseModuleName (name, dirname) {
  if (name[0] === '.') {
    return path.join(dirname, name)
  }
  return pattern
}

function createSegmentInstances (pipelineConfig, dirname) {
  return pipelineConfig
    .map((segment) => {
      const moduleName = normaliseModuleName(segment.require, dirname)
      return require(moduleName)(segment)
    })

}

module.exports = createSegmentInstances
