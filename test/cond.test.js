/* eslint-env node, mocha */
const { assert } = require('chai')
const itools = require('iter-tools')
const { cond } = require('../src/segments')

describe('cond', () => {
  it('passthrough if false', async () => {
    const iter = cond((item) => item % 2 === 0, itools.asyncMap((item) => item * 2))
    const sequence = await itools.asyncIterToArray(iter([1, 2, 3, 4]))
    assert.deepEqual(sequence, [1, 4, 3, 8])
  })

  it('work with 2 branches', async () => {
    const iter = cond((item) => item % 2 === 0, itools.asyncMap((item) => item * 2), itools.asyncMap((item) => item * 3))
    const sequence = await itools.asyncIterToArray(iter([1, 2, 3, 4]))
    assert.deepEqual(sequence, [3, 4, 9, 8])
  })
})
