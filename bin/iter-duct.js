#!/usr/bin/env node

const help = `
iter-duct: an utility to run pipelines

Options:

--config file.js
Configuration file.It defaults to iter-duct.config.js in the package root

--pipeline pipeline1,pipeline2
(Optional) the pipelines to run.
`

const iterDuct = require('../src/cmd')
const argv = require('minimist')(process.argv.slice(2))

const pipelineNameCfg = argv.pipeline
const configFile = argv.config || 'iter-duct.config.js'

let pipeline
try {
  pipeline = iterDuct({ pipelineNameCfg, configFile, argv })
} catch (e) {
  console.log(help)
  console.log('Error:', e.message)
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
