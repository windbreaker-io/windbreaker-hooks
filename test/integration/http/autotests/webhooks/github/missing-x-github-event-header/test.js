const generateSignature = require('~/test/util/generateSignature')

module.exports = {
  description: 'should receive 400 error for requesting without an x-github-event header',
  expectError: true,
  type: 'GITHUB',
  request (t) {
    const { request, endpoint, payload } = t.context
    return request
      .post(endpoint)
      .set('x-hub-signature', generateSignature(payload))
      .send(payload)
  }
}
