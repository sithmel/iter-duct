/* eslint-env node, mocha */
const assert = require('chai').assert
const iterDuct = require('../src/cmd')

describe('iterDuct', function () {
  it('sets up a pipeline', async function () {
    const id = await iterDuct({ modulePath: __dirname })
    assert.deepEqual(await id.toArray(), [2, 4, 6])
  })
})

describe('iterDuct async', function () {
  it('sets up a pipeline', async function () {
    const id = await iterDuct({ modulePath: __dirname, configFile: 'iter-duct.configasync.js' })
    assert.deepEqual(await id.toArray(), [2, 4, 6])
  })
})
