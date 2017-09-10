exports.description = 'should receive 400 error for requesting with an invalid x-github-event'
exports.type = 'GITHUB'
exports.expectError = true

exports.request = function ({ request, id, httpServerPort, endpoint, payload, signatureBuilder }) {
  return request
    .post(endpoint)
    .set('x-github-event', 'INVALID')
    .set('x-hub-signature', signatureBuilder(payload))
    .send(payload)
}
