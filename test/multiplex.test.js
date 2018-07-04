/* eslint-env node, mocha */
const { assert } = require('chai')
const itools = require('iter-tools')
const { multiplex } = require('../src/segments')

describe('multiplex', () => {
  it('to array', async () => {
    const iter = multiplex([itools.asyncMap((item) => item * item), itools.asyncMap((item) => item * 2)])
    const multiplexed = await itools.asyncIterToArray(iter([2, 4, 6]))
    assert.deepEqual(multiplexed, [[4, 4], [16, 8], [36, 12]])
  })

  it('to object', async () => {
    const iter = multiplex({
      a: itools.asyncMap((item) => item * item),
      b: itools.asyncMap((item) => item * 2)
    })
    const multiplexed = await itools.asyncIterToArray(iter([2, 4, 6]))
    assert.deepEqual(multiplexed, [
      { a: 4, b: 4 },
      { a: 16, b: 8 },
      { a: 36, b: 12 }
    ])
  })

  it('to object, using shortcut', async () => {
    const iter = multiplex({
      a: '.',
      b: 'a'
    })
    const multiplexed = await itools.asyncIterToArray(iter([{ a: 1 }, { a: 2 }, { a: 3 }]))
    assert.deepEqual(multiplexed, [
      { a: { a: 1 }, b: 1 },
      { a: { a: 2 }, b: 2 },
      { a: { a: 3 }, b: 3 }
    ])
  })
})
