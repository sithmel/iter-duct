iter-duct
=========
[![Build Status](https://travis-ci.org/tes/iter-duct.svg?branch=master)](https://travis-ci.org/tes/iter-duct)

iter-duct is a command line tool to execute pipelines, useful for migration scripts and when you have a sequence of items that needs to be transformed and written somewhere.

iter-duct is based on async-iterables (node 10+). It works on a "pull model", that removes many issues you can have using streams directly.

pipeline and segments
---------------------
A segment is a function that takes a sequence (async iterable) and returns another sequence. You form a pipeline when you set up a series of segments in a specific order.
The first segment of the pipeline acts as a generator: it reads the data somewhere and emits the data as iterable to the next segments.
The last segment of the pipeline is usually in charge of writing the data somewhere else.

why using this
--------------
Every time you write a migration script you are dealing with a few common tasks:

* writing a command line interface or a configuration
* decide what abstraction use for the sequence (array, streams ...)
* dealing with code reusability

iter-duct provides an interface to build a pipeline out of reusable and testable components (pipeline segments).

How to use it
-------------
You add iter-duct to you package:
```
npm install --save iter-duct
```
You can configure your pipeline using a plain javascript file called "iter-duct.conf.js" in the root of your package. You can expose the configuration as array:
```js
const readCSV = require('iter-duct-utils/readCSV')
const writeJSON = require('iter-duct-utils/writeJSON')

module.exports = [
  readCSV({ filename: 'data.csv' }),
  writeJSON({ filename: (data) => `${data.id}.json` }),
]
...
```
and run it with:
```
npx iter-duct
```
or as an object:
```js
const readCSV = require('iter-duct/readCSV')
const writeJSON = require('iter-duct/writeJSON')

module.exports = {  
  migration1: [
    readCSV({ filename: 'data.csv' }),
    writeJSON({ filename: (data) => `${data.id}.json` }),
  ]
}
...
```
and run it with:
```
npx iter-duct -pipeline migration1
```
You can also use a different config file:
```
npx iter-duct -config special.js
```
or you define a script in your package.json:
```
  "scripts": {
    "pipeline": "iter-duct"
  }
```
The default name for a pipeline is "pipeline" but you can use different names:
```
npx iter-duct -pipeline migration-pipeline
```

Writing a pipeline segments
---------------------------
A pipeline segment is a reusable unit of code. It is a function that takes the configuration as argument, and returns an async-iterator that takes an iterable as input and returns an iterable:
```js
function doNothing({ filename }) {
  return async function * (iterable) {
    for await (const item of iterable) {
      yield item
    }
  }
}
```
This segment is just a pass-through, but you can:
* filter the iterable
* transform the iterable
* ignore the input iterable and generate a new one (reading data for example)
* write the data coming from an input iterable

An important caveat is that you **always** yield something as output, even if your segment is intended to be the last segment of the pipe.

You can find examples and some useful pipeline segments in iter-duct-utils

Javascript API
--------------
iter-duct exposes a js api too!
```js
const IterDuct = require('iter-duct')
const id = new IterDuct(pipeline) // pipeline is aan array of segments as defined in the configuration
id.run() // it runs a pipeline, returns a promise
id.toArray() // it runs the pipeline and returns an array with all items (useful for debugging)
id.iter() // returns the iterator
```
