exports.description = 'should handle valid push payload'
exports.type = 'GITHUB'
exports.expectError = true

exports.request = function ({ request, id, httpServerPort, endpoint, payload }) {
  return request
    .post(endpoint)
    .set('x-github-event', 'INVALID')
    .send(payload)
}
