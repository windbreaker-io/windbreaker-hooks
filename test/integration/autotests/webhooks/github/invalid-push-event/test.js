const generateSignature = require('~/test/util/generateSignature')

exports.description = 'should receive 400 error for requesting with a webhook payload with invalid properties'
exports.expectError = true
exports.type = 'GITHUB'

exports.request = function ({ request, id, httpServerPort, endpoint, payload }) {
  const sig = generateSignature(payload)
  return request
    .post(endpoint)
    .set('x-github-event', 'push')
    .set('x-hub-signature', sig)
    .send(payload)
}
