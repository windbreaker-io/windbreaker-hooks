const fs = require('fs')
const config = require('~/src/config')

module.exports = {
  start () {
    fs.readFileSync(config.getGithubWebhookSecretPath(), 'utf-8')
  }
}
