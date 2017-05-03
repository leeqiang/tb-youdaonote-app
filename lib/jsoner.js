'use strict'
const fs = require('fs')
const path = require('path')
const fileName = path.join(__dirname, 'token.json')

const jsonStringify = function (data, space) {
  let seen = []
  return JSON.stringify(data, function (key, val) {
    if (!val || typeof (val) !== 'object') return val
    if (seen.indexOf(val) !== -1) return '[Circular]'
    seen.push(val)
    return val
  }, space)
}

exports.readJSONFile = function () {
  let content = fs.readFileSync(fileName)
  if (content) {
    return JSON.parse(content.toString() || '{}')
  }
  return {}
}

exports.writeJSONFile = function (data) {
  let content = jsonStringify(data, 2)
  fs.writeFileSync(fileName, content)
}
