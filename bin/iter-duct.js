#!/usr/bin/env node

const iterDuct = require('../src')
const argv = require('minimist')(process.argv.slice(2))
const it = require('iter-tools/es2018')

const pipelineName = argv.pipeline || 'pipeline'
const configFile = argv.config || 'iter-duct.config.js'

const iterable = iterDuct({ pipelineName, configFile })

it.asyncConsume(() => {}, iterable)
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
