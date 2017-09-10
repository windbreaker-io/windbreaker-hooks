require('require-self-ref')

const config = require('~/src/config')
const logger = require('~/src/logging').logger(module)
const koaBody = require('koa-body')()
const crypto = require('crypto')

const SHARED_SECRET = config.getGithubWebhookSecret()
const SIGNATURE_HEADER = 'x-hub-signature'

function verifyGithubSignature (ctx, request) {
  const hmac = crypto.createHmac('sha1', SHARED_SECRET)
  hmac.update(JSON.stringify(request.body))
  const expectedSignature = `sha1=${hmac.digest('hex')}`
  const actualSignature = request.headers[SIGNATURE_HEADER]

  console.log('expected, actual', expectedSignature, actualSignature)

  // Avoid timing attacks
  if (!crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(actualSignature))) {
    throw new Error('github signature did not match expected')
  }
}

module.exports = function () {
  return [
    koaBody,
    async function (ctx, next) {
      ctx.body = ctx.request.body

      try {
        verifyGithubSignature(ctx, ctx.request)
      } catch (err) {
        logger.error('Error while verifying github signature', err)
        ctx.throw(401, 'bad signature')
      }

      await next()
    }
  ]
}
