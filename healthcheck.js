'use strict'

// https://github.com/BretFisher/node-docker-good-defaults
const http = require('http')

const options = {
  timeout: 2000,
  host: 'localhost',
  port: process.env.PORT || 8085,
  path: '/caravel/v1/healthcheck'
}

const request = http.request(options, (res) => {
  console.info('STATUS: ' + res.statusCode)
  process.exitCode = (res.statusCode === 200) ? 0 : 1
  process.exit()
})

request.on('error', function (err) {
  console.error('Error in docker-compose healthcheck script', err)
  process.exit(1)
})

request.end()
