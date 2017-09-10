const buildEndpoint = require('~/test/util/buildEndpoint')

exports.description = 'should receive 401 error when requesting with an invalid hmac signature'
exports.expectError = true
const type = exports.type = 'GITHUB'

exports.request = function ({ request, id, httpServerPort, endpoint, payload, signatureBuilder }) {
  return request
    .post(buildEndpoint({ type, httpServerPort }))
    .set('x-hub-signature', 'sha1=badSignature')
    .send(payload)
}
