exports.description = 'should receive 400 error for requesting without an x-github-event header'
exports.expectError = true
exports.type = 'GITHUB'

exports.request = function ({ request, id, httpServerPort, endpoint, payload, signatureBuilder }) {
  return request
    .post(endpoint)
    .set('x-hub-signature', signatureBuilder(payload))
    .send(payload)
}
