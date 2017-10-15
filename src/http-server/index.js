const { createServer } = require('windbreaker-service-util/http')
const logger = require('~/src/logging').logger(module)

let server

const routes = [
  '~/src/http-server/routes/healthcheck',
  '~/src/http-server/routes/github'
].map((routePath) => require(routePath))

exports.create = function () {
  const config = require('~/src/config')
  const httpServerPort = config.getHttpServerPort()
  server = createServer({ httpServerPort, routes, logger })
}

exports.close = function () {
  return server.close()
}
