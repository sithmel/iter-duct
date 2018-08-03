const it = require('iter-tools/es2018')
const _ = require('lodash')

const fromPairs = it.reduce((obj = {}, arr) => {
  const [k, v] = arr
  obj[k] = v
  return obj
})

/* passThrough */

function passthrough () {
  return function (iterable) {
    return iterable
  }
}

/* getSegment */

function getSegment (segment) {
  if (segment === null || segment === '.') {
    return passthrough()
  } else if (typeof segment === 'string') {
    return it.asyncMap((item) => _.get(item, segment))
  } else if (Array.isArray(segment)) {
    return combine(segment)
  } else if (segment.constructor === Object) {
    return multiplex(segment)
  } else {
    return segment
  }
}

function combine (segments) {
  return it.compose(segments.reverse().map(getSegment))
}

/* multiplex */

function multiplex (options) {
  let segments, keys
  if (Array.isArray(options)) {
    segments = options.map(getSegment)
  } else if (options.constructor === Object) {
    segments = Object.values(options).map(getSegment)
    keys = Object.keys(options)
  }

  return function (iterable) {
    const iterables = it.asyncTee(iterable, segments.length)
    const segmentInstances = it.map(
      ([segment, iterable]) => segment(iterable),
      it.zip(segments, iterables))

    const zippedSequence = it.asyncZipLongest(...it.chain([null], segmentInstances))
    if (keys) {
      return it.asyncMap(arr => fromPairs(it.zip(keys, arr)), zippedSequence)
    }
    return zippedSequence
  }
}

/* cond */

const invertPredicate = (func) => (arg) => !func(arg)

function cond (predicate, ifTrue, ifFalse) {
  ifFalse = ifFalse || passthrough()
  const ifTrueSegment = getSegment(ifTrue)
  const ifFalseSegment = getSegment(ifFalse)
  const oppositePredicate = invertPredicate(predicate)
  return async function * (iterable) {
    const [originalIterable, copyIterable1, copyIterable2] = it.asyncTee(iterable, 3)
    const ifTrueIterable = ifTrueSegment(it.asyncFilter(predicate, copyIterable1))
    const ifFalseIterable = ifFalseSegment(it.asyncFilter(oppositePredicate, copyIterable2))
    try {
      for await (const item of originalIterable) {
        if (predicate(item)) {
          yield (await ifTrueIterable.next()).value
        } else {
          yield (await ifFalseIterable.next()).value
        }
      }
    } finally {
      if (typeof ifTrueIterable.return === 'function') ifTrueIterable.return()
      if (typeof ifFalseIterable.return === 'function') ifFalseIterable.return()
    }
  }
}

module.exports = {
  multiplex,
  getSegment,
  passthrough,
  cond
}
