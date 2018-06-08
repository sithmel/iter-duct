/* eslint-env node, mocha */
const assert = require('chai').assert
const getPipelineConfig = require('../src/get-pipeline-config')

describe('getPipelineConfig', function () {
  it('prepare the array', function () {
    const cfg = {
      segment1: {
        hello: 1
      },
      pipeline: [
        'segment1',
        { world: 2 }
      ]
    }
    assert.deepEqual(getPipelineConfig(cfg), [
      { hello: 1 },
      { world: 2 },
    ])
  })
})
