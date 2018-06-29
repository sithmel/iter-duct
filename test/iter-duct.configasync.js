const testModule1 = require('./test-module1')
const testModule2 = require('./test-module2')

module.exports = async function () {
  return [
    testModule1(),
    testModule2()
  ]
}
