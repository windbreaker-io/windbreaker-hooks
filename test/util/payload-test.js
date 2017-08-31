const fs = require('fs')
const path = require('path')
const request = require('superagent')
const uuid = require('uuid')
const dao = require('~/src/dao')

exports.register = function ({ test, dir }) {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const payload = require(path.join(dir, file, 'payload.json'))
    const testFile = require(path.join(dir, file, 'test.js'))

    test.beforeEach(async (t) => {
      const id = uuid.v4()
      t.context = { id }

      const res = await dao.insert({ id, type: testFile.type })
      console.log('Res: ', res)
    })

    test(`payload test ${file}`, async (t) => {
      const response = await request
        .post(testFile.endpoint)
        .send(payload)
      t.snapshot(response)
    })
  })
}
