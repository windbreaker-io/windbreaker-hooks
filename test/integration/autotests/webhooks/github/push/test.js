exports.description = 'should handle valid push payload'
exports.type = 'GITHUB'

exports.request = function ({ request, id, httpServerPort, endpoint, payload, signatureBuilder }) {
  return request
    .post(endpoint)
    .set('x-github-event', 'push')
    .set('x-hub-signature', signatureBuilder(payload))
    .send(payload)
}
