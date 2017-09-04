const fs = require('fs')
const path = require('path')
const request = require('superagent')
const uuid = require('uuid')
const dao = require('~/src/dao')
const buildEndpoint = require('~/test/util/buildEndpoint')

async function webhookBeforeEach (testFile, t) {
  const id = uuid.v4()
  t.context = { id }
  await dao.insert(id, testFile.type)
}

async function webhookAfterEach (testFile, t) {
  const { id } = t.context

  try {
    await dao.deleteById(id)
  } catch (err) {
    // If an error is expected, ignore if the delete fails
    if (testFile.expectError !== true) {
      throw err
    }
  }
}

function buildTest ({ testFile, context, dir, file, webhook }) {
  let payload
  try {
    payload = require(path.join(dir, file, 'payload.json'))
  } catch (err) {
    payload = {}
  }

  const expectError = testFile.expectError

  return async (t) => {
    let runAfterEach = false

    try {
      if (webhook) {
        await webhookBeforeEach(testFile, t)
      }

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

        if (expectError === true) {
          throw new Error('An error was expected in this request')
        }
      } catch (err) {
        if (expectError !== true) {
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

      runAfterEach = true

      if (webhook) {
        await webhookAfterEach(testFile, t)
      }
    } catch (err) {
      if (webhook && !runAfterEach) {
        await webhookAfterEach(testFile, t)
      }

      throw err
    }
  }
}

exports.register = function ({ test, dir, webhook, context }) {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const testFile = require(path.join(dir, file, 'test.js'))

    let testDescription = `payload test "${file}"`

    if (testFile.description) {
      testDescription += ` - ${testFile.description}`
    }

    test(testDescription, buildTest({ testFile, context, dir, file, webhook }))
  })
}
