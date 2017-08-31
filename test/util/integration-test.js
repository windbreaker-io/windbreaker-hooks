const server = require('../../src/server')
const porti = require('porti')

exports.register = function ({ test, context = {} }) {
  test.before(async () => {
    const httpServerPort = await porti.getUnusedPort()
    await server.start({ httpServerPort })

    context.httpServerPort = httpServerPort
  })
}
