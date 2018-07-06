#!/usr/bin/env node

const iterDuct = require('../src/cmd')
const argv = require('minimist')(process.argv.slice(2))

const pipelineName = argv.pipeline || 'pipeline'
const configFile = argv.config || 'iter-duct.config.js'

iterDuct({ pipelineName, configFile, argv })
  .then(id => id.run())
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
