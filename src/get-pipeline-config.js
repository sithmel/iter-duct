const _ = require('lodash')

function getPipelineConfig(cfg, pipelineName = 'pipeline') {
  const pipeline = cfg[pipelineName]
  if (!Array.isArray(pipeline)) {
    throw new Error(`Pipeline configuration "${pipelineName}" not found`)
  }
  return pipeline
    .map((segment) => {
      if (typeof segment === 'string') {
        return _.get(cfg, segment)
      }
      return segment
    })
}

module.exports = getPipelineConfig
