const path = require('path')
const test = require('ava')
const server = require('~/src/server')
const startupTasks = require('~/src/startup-tasks')

const payloadTestDir = path.join(__dirname, '/autotests/healthcheck')

require('windbreaker-service-util/testing/payload-test').register({
  buildEndpoint (t) {
    const { httpServerPort } = t.context
    return `:${httpServerPort}/healthcheck`
  },
  test,
  server,
  startupTasks,
  dir: payloadTestDir
})
