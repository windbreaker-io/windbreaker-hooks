module.exports = function buildEndpoint ({ id, type, httpServerPort }) {
  let endpoint = `:${httpServerPort}/${type.toLowerCase()}`

  // TODO: use id for bitbucket/other or remove entirely
  if (id) {
    endpoint += `/${id}`
  }

  return endpoint
}
