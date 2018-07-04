const it = require('iter-tools/es2018')
const {
  multiplex,
  getSegment,
  passthrough
} = require('./segments')

class IterDuct {
  constructor (pipeline) {
    this.iter = getSegment(pipeline)
  }

  run () {
    return it.asyncConsume(() => {}, this.iter())
  }

  toArray () {
    return it.asyncIterToArray(this.iter())
  }
}

module.exports = {
  IterDuct,
  multiplex,
  getSegment,
  passthrough
}
