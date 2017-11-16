const generateSignature = require('~/test/util/generateSignature')

module.exports = {
  description: 'should receive 400 error for requesting with a webhook payload with invalid properties',
  expectError: true,
  type: 'GITHUB',
  request (t) {
    const { request, endpoint, payload } = t.context
    const sig = generateSignature(payload)
    return request
      .post(endpoint)
      .set('x-github-event', 'push')
      .set('x-hub-signature', sig)
      .send(payload)
  }
}
