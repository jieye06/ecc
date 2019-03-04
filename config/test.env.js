'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  SESSION_INVALID_URL: '"10.101.0.184:8081/"'
})
