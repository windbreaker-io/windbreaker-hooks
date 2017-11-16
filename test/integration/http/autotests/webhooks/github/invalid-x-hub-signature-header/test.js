module.exports = {
  description: 'should receive 401 error when requesting with an invalid hmac signature',
  expectError: true,
  type: 'GITHUB',
  request (t) {
    const { request, endpoint, payload } = t.context
    return request
      .post(endpoint)
      .set('x-hub-signature', 'sha1=badSignature')
      .send(payload)
  }
}
