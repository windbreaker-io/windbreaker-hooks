const generateSignature = require('~/test/util/generateSignature')

exports.description = 'should handle valid push payload'
exports.type = 'GITHUB'

exports.request = function ({ request, id, httpServerPort, endpoint, payload }) {
  return request
    .post(endpoint)
    .set('x-github-event', 'push')
    .set('x-hub-signature', generateSignature(payload))
    .send(payload)
}
