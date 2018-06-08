/* eslint-env node, mocha */
const assert = require('chai').assert
const itools = require('iter-tools')
const createSegmentInstances = require('../src/create-segment-instances')

describe('createSegmentInstances', function () {
  it('require and set up modules', async function () {
    const instances = createSegmentInstances([
      {
        require: './test-module1'
      }
    ], __dirname)
    assert.deepEqual(await itools.asyncIterToArray(instances[0]), [1, 2, 3])
  })
})
