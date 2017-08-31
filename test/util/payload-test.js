const fs = require('fs')
const path = require('path')
const request = require('superagent')
const uuid = require('uuid')
const dao = require('~/src/dao')
const buildEndpoint = require('~/test/util/buildEndpoint')

exports.register = function ({ test, dir, context }) {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const payload = require(path.join(dir, file, 'payload.json'))
    const testFile = require(path.join(dir, file, 'test.js'))

    let testDescription = `payload test "${file}"`

    if (testFile.description) {
      testDescription += ` - ${testFile.description}`
    }

    test.beforeEach(async (t) => {
      const id = uuid.v4()
      t.context = { id }

      await dao.insert(id, testFile.type)
    })

    test(testDescription, async (t) => {
      const { type } = testFile
      const { id } = t.context
      const { httpServerPort } = context
      const endpoint = buildEndpoint(id, type, httpServerPort)

      let response
      try {
        if (testFile.request) {
          response = await testFile.request({ request, id, httpServerPort, endpoint, payload })
        } else {
          response = await request
            .post(endpoint)
            .send(payload)
        }

        if (testFile.expectError) {
          throw new Error('An error was expected in this request')
        }
      } catch (err) {
        if (!testFile.expectError) {
          throw err
        }

        response = err.response
      }

      const snapshot = {
        body: response.body,
        status: response.status
      }

      if (response.error) {
        snapshot.error = response.error.text
      }

      t.snapshot(snapshot)
    })
  })
}
