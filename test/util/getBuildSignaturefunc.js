const crypto = require('crypto')
const config = require('~/src/config')

config.load()
const SHARED_SECRET = config.getGithubWebhookSecret()

module.exports = function getBuildSignatureFunc (type) {
  if (type !== 'GITHUB') {
    return
  }

  const hmac = crypto.createHmac('sha1', SHARED_SECRET)
  return function (body) {
    return `sha1=${hmac.update(JSON.stringify(body)).digest('hex')}`
  }
}
