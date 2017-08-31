require('require-self-ref')

const path = require('path')
const test = require('ava')

const payloadTestDir = path.join(__dirname, '/autotests/webhooks/github')
let context = {}

require('~/test/util/integration-test').register({ test, context })
require('~/test/util/payload-test').register({
  test,
  dir: payloadTestDir,
  context
})
