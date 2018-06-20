const it = require('iter-tools/es2018')

class IterDuct {
  constructor (pipeline) {
    this.iter = it.compose(pipeline.reverse())
  }

  run () {
    return it.asyncConsume(() => {}, this.iter())
  }

  toArray () {
    return it.asyncIterToArray(this.iter())
  }
}

module.exports = IterDuct
