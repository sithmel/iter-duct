const iterDuct = require('../src')
const argv = require('minimist')(process.argv.slice(2));

async function consumeIterable(iterable) {
  for await (const i of iterable) {}
}

const pipelineName = argv.p || 'pipeline'
iterDuct({ pipelineName })
  .then(consumeIterable)
  .catch(err => {
    console.error(err)
  })
