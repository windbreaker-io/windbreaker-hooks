const generateSignature = require('~/test/util/generateSignature')

exports.description = 'should handle valid installation payload'
exports.type = 'GITHUB'

exports.request = function ({ request, id, httpServerPort, endpoint, payload }) {
  return request
    .post(endpoint)
    .set('x-github-event', 'installation')
    .set('x-hub-signature', generateSignature(payload))
    .send(payload)
}
