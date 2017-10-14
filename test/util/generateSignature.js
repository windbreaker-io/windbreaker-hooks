const crypto = require('crypto')
const config = require('~/src/config')

config.load()
const SHARED_SECRET = config.getGithubWebhookSecret()

module.exports = (body) => {
  const hmac = crypto.createHmac('sha1', SHARED_SECRET)
  return `sha1=${hmac.update(JSON.stringify(body)).digest('hex')}`
}
