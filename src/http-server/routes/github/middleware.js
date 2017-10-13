const crypto = require('crypto')
const config = require('~/src/config')
const logger = require('~/src/logging').logger(module)

const SHARED_SECRET = config.getGithubWebhookSecret()
const SIGNATURE_HEADER = 'x-hub-signature'

function verifyGithubSignature (body, headers) {
  const hmac = crypto.createHmac('sha1', SHARED_SECRET)
  hmac.update(JSON.stringify(body))
  const expectedSignature = `sha1=${hmac.digest('hex')}`
  const actualSignature = headers[SIGNATURE_HEADER]

  // Avoid timing attacks
  if (!crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(actualSignature))) {
    throw new Error('github signature did not match expected')
  }
}

module.exports = async function (ctx, next) {
  try {
    verifyGithubSignature(ctx.request.body, ctx.request.headers)
  } catch (err) {
    logger.error('Error while verifying github signature', err)
    ctx.throw(401, 'bad signature')
  }
  await next()
}
