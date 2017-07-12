// const GithubPush = require('windbreaker-service-utils/models/events/webhook/github/GithubPush')
// const validateRequestId = require('~/src/util/dao/validateRequestId')
const logger = require('~/src/logging').logger(module)

module.exports = {
  method: 'GET',
  path: '/github/:id',
  handler: async function (ctx) {
    const [ id ] = ctx.params
    logger.info('Received request with ID: ', id)
  }
}
