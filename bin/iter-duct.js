#!/usr/bin/env node

const iterDuct = require('../src')
const argv = require('minimist')(process.argv.slice(2))

async function consumeIterable(iterable) {
  for await (const i of iterable()) {}
}

const pipelineName = argv.pipeline || 'pipeline'
const configFile = argv.config || 'iter-duct.config.js'
const conflab = !!argv.useConflab

iterDuct({ pipelineName, configFile, conflab })
  .then((iterable) => {
    return consumeIterable(iterable)
  })
  .catch(err => {
    console.error(err)
  })
