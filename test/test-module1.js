module.exports = function () {
  return async function * (iterable) {
    yield * [1, 2, 3]
  }
}
