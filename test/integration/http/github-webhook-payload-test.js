const path = require('path')
const test = require('ava')
const server = require('~/src/server')
const startupTasks = require('~/src/startup-tasks')

const githubWebhookTestDir = path.join(__dirname, '/autotests/webhooks/github')

require('./webhook-payload-tester').register({
  test,
  server,
  startupTasks,
  dir: githubWebhookTestDir
})
