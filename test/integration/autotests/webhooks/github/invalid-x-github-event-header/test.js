exports.description = 'should receive 400 error for invalid x-github-event'
exports.type = 'GITHUB'
exports.expectError = true

exports.request = function ({ request, id, httpServerPort, endpoint, payload }) {
  return request
    .post(endpoint)
    .set('x-github-event', 'INVALID')
    .send(payload)
}
