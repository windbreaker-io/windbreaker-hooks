const generateSignature = require('~/test/util/generateSignature')

module.exports = {
  description: 'should handle valid installation payload',
  type: 'GITHUB',
  request (t) {
    const { request, endpoint, payload } = t.context
    return request
      .post(endpoint)
      .set('x-github-event', 'installation')
      .set('x-hub-signature', generateSignature(payload))
      .send(payload)
  }
}
