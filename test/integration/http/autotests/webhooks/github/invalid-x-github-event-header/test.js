const generateSignature = require('~/test/util/generateSignature')

module.exports = {
  description: 'should receive 400 error for requesting with an invalid x-github-event',
  type: 'GITHUB',
  expectError: true,
  request (t) {
    const { request, endpoint, payload } = t.context
    return request
      .post(endpoint)
      .set('x-github-event', 'INVALID')
      .set('x-hub-signature', generateSignature(payload))
      .send(payload)
  }
}
