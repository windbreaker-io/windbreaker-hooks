const fs = require('fs')
const path = require('path')
const request = require('superagent')
const uuid = require('uuid')
const dao = require('~/src/dao')
const buildEndpoint = require('~/test/util/buildEndpoint')

exports.register = function ({ test, dir, webhook, context }) {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    let payload
    try {
      payload = require(path.join(dir, file, 'payload.json'))
    } catch (err) {
      payload = {}
    }

    const testFile = require(path.join(dir, file, 'test.js'))

    let testDescription = `payload test "${file}"`

    if (testFile.description) {
      testDescription += ` - ${testFile.description}`
    }

    if (webhook) {
      test.beforeEach(async (t) => {
        const id = uuid.v4()
        t.context = { id }

        await dao.insert(id, testFile.type)
      })

      // TODO: afterEach delete the webhook
    }

    test(testDescription, async (t) => {
      const { type } = testFile
      const { httpServerPort } = context

      let id
      if (t.context) {
        id = t.context.id
      }

      const endpoint = buildEndpoint({ id, type, httpServerPort })

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
