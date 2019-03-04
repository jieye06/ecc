'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"/ecc-controller"',
  SESSION_INVALID_URL: '"http://10.101.0.184:8081/#/"'
})
