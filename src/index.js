const it = require('iter-tools/es2018')
const {
  multiplex,
  getSegment,
  passthrough,
  cond
} = require('./segments')
const { setLogger, getLogger, replaceLogger } = require('./logger')

class IterDuct {
  constructor (pipelines, logger) {
    this.pipelines = pipelines.map(getSegment)
  }

  async run () {
    for (const pipeline of this.pipelines) {
      await it.asyncConsume(() => {}, pipeline())
    }
  }

  async toArray () {
    const out = []
    for (const pipeline of this.pipelines) {
      out.push(await it.asyncIterToArray(pipeline()))
    }
    return out
  }
}

module.exports = {
  IterDuct,
  multiplex,
  getSegment,
  passthrough,
  cond,
  setLogger,
  getLogger,
  replaceLogger
}
