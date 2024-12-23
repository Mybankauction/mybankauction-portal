const { createProxyMiddleware } = require('http-proxy-middleware')

const zohoOptions = {
  target: 'https://www.zohoapis.in', // Zoho API URL
  changeOrigin: true, // Ensures that the Origin header matches the target
  pathRewrite: { '^/zoho': '' }, // Rewrites the /zoho prefix
  onProxyReq: (proxyReq, req, res) => {
    // Remove the Origin header
    proxyReq.removeHeader('Origin')
  },
}

const zohoProxy = createProxyMiddleware(zohoOptions)

exports.handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    if (event.path.startsWith('/zoho')) {
      zohoProxy(event, context, (err, response) => {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      })
    } else {
      resolve({
        statusCode: 404,
        body: 'Not Found',
      })
    }
  })
}
