/* eslint-env node, mocha */
const assert = require('chai').assert
const iterDuct = require('../src/cmd')

describe('iterDuct', function () {
  it('sets up a pipeline', async function () {
    const id = iterDuct({ modulePath: __dirname })
    assert.deepEqual(await id.getArray(), [2, 4, 6])
  })
})
