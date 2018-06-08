module.exports = function () {
  return async function * (iterable) {
    for await (const i of iterable) {
      yield i * 2
    }
  }
}
