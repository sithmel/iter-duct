#!/usr/bin/env node

const iterDuct = require('../src/cmd')
const argv = require('minimist')(process.argv.slice(2))
const it = require('iter-tools/es2018')

const pipelineName = argv.pipeline || 'pipeline'
const configFile = argv.config || 'iter-duct.config.js'

const id = iterDuct({ pipelineName, configFile })

id
  .run()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
