/* eslint-env node, mocha */
const path = require('path')
const assert = require('chai').assert
const loadConfig = require('../src/load-config')

describe('loadConfig', function () {
  it('loadConfig here', async function () {
    const cfg = await loadConfig(path.join(__dirname, 'config'))
    assert.equal(cfg.test, 'hello')
    assert.equal(cfg.test2, 'hello world!')
  })
})
