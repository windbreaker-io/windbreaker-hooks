# windbreaker-hooks
Windbreaker webhooks


---

### Config

The following config is needed for end-to-end functionality. It is _not_ needed for running tests. All secrets should placed in a directory `.secrets/` in your project root.


##### Github hooks secret

`.secrets/github-hooks-secret`

This is your generated private key shared with github so that windbreaker-hooks can verify event payload authenticity. See [Github docs.](https://developer.github.com/webhooks/securing/#setting-your-secret-token)
