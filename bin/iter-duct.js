#!/usr/bin/env node

const iterDuct = require('../src/cmd')
const argv = require('minimist')(process.argv.slice(2))

const pipelineName = argv.pipeline
const configFile = argv.config || 'iter-duct.config.js'

let pipeline
try {
  pipeline = iterDuct({ pipelineName, configFile, argv })
} catch (e) {
  console.log(e.message)
  process.exit(1)
}

pipeline
  .then(id => id.run())
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
