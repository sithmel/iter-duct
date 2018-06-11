/* eslint-env node, mocha */
const assert = require('chai').assert
const itools = require('iter-tools')
const iterDuct = require('../src')

describe('iterDuct', function () {
  it('sets up a pipeline', async function () {
    const iter = await iterDuct({ pipelineName: 'pipeline', modulePath: __dirname, conflab: true })
    assert.deepEqual(await itools.asyncIterToArray(iter), [2, 4, 6])
  })
})
