const uuid = require('uuid')
const payloadTest = require('windbreaker-service-util/testing/payload-test')
const dao = require('~/src/dao')
const addToContext = require('windbreaker-service-util/testing/addToContext')

async function beforeEach (t) {
  const { testFile } = t.context
  const { type, expectError } = testFile
  const id = uuid.v4()
  addToContext(t, { id, type, expectError })
  return dao.insert(id, type)
}

async function afterEach (t) {
  const { id, expectError } = t.context

  try {
    await dao.deleteById(id)
  } catch (err) {
    // If an error is expected, ignore if the delete fails
    if (expectError !== true) {
      throw err
    }
  }
}

exports.register = function (testOptions) {
  payloadTest.register(Object.assign({
    buildEndpoint (t) {
      const { httpServerPort, type } = t.context
      return `:${httpServerPort}/${type.toLowerCase()}`
    },
    beforeEach,
    afterEach
  }, testOptions))
}
