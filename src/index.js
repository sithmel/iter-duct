const it = require('iter-tools/es2018')
const {
  multiplex,
  getSegment,
  passthrough
} = require('./segments')

class IterDuct {
  constructor (pipelines) {
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
  passthrough
}
