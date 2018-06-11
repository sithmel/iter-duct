iter-duct
=========
[![Build Status](https://travis-ci.org/tes/iter-duct.svg?branch=master)](https://travis-ci.org/tes/iter-duct)

iter-duct is a command line tool to execute pipelines, useful for migration scripts and any way you have a sequence of items that needs to be transformed and written somewhere.

iter-duct is based on async-iterables (node 10+), the

why using this
--------------
Every time you write a migration script you are dealing with a few common tasks:

* writing a command line interface or a configuration
* decide what abstraction use for the sequence (array, streams ...)
* dealing with code reusability

Also:

* writing unit tests on a pipeline fragment is much simpler
* a common interface helps you to reuse pipeline fragments
* async-iterables works on a "pull model", that removes many issues you can have using streams directly

How to use it
-------------
You add iter-duct to you package:
```
npm install --save iter-duct
```
If you use conflab you can add the pipeline configuration into it:
```json
...
  "pipeline": [
    { "require": "iter-duct/readCSV", "filename": "data.csv" },
    { "require": "iter-duct/writeJSON", "filenames": "$n.json" }
  ]
...
```
to make things more readable you can define the pipeline this way:
```json
...
  "readCSV": {
    "require": "iter-duct/readCSV",
    "filename": "data.csv"
  },
  "writeJSON": {
    "require": "iter-duct/writeJSON",
    "filenames": "$n.json"
  },
  "pipeline": [
    "readCSV", "writeJSON"
  ]
...
```
you can also use some template substitution using handlebar syntax:
```json
  "csvFilename": "data.csv",
...
  "readCSV": {
    "require": "iter-duct/readCSV",
    "filename": "{{csvFilename}}"
  },
...
```
To run the script you then run:
```
npx iter-duct
```
or you define a script in your package.json:
```
  "scripts": {
    "pipeline": "iter-duct"
  }
```
The default name for a pipeline is "pipeline" but you can use different names:
```
npx iter-duct -p migration-pipeline
```

Configuring a pipeline in js
----------------------------
The equivalent of:
```json
"readCSV": {
  "require": "iter-duct/readCSV",
  "filename": "{{csvFilename}}"
},
```
is:
```js
const readCSV = require('iter-duct/readCSV')
readCSV({ filename: 'data.csv' }),
```
so you can translate the config in json into:
```js
const readCSV = require('iter-duct/readCSV')
const writeJSON = require('iter-duct/writeJSON')

module.exports = {  
  pipeline: [
    readCSV({ filename: 'data.csv' }),
    writeJSON({ filename: '$n.json' }),
  ]
}
...
```
If you prefer this simpler way to write the configuration you can run:
```
npx iter-duct -c config.js
```
You can see that this is little magic in this. The only thing iter-duct does is to composes all segments together.

Pipeline segments
-----------------
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

Build your own pipeline fragment
--------------------------------
You can use this as a model:
```js
function doNothing({ filename }) {
  return async function * (iterable) {
    for await (const item of iterable) {
      yield item
    }
  }
}
```
An important caveat is that you **always** yield something as output, even if your segment is intended to be the last segment of the pipe.

Use iter-tools
--------------
iter-tools is an iterators toolbox, you will find many useful function to write pipelines in there.

batteries included
------------------
This package contains many ready to be used, generic pipeline fragments...
