const { createProxyMiddleware } = require('http-proxy-middleware')

const zohoOptions = {
  target: 'https://www.zohoapis.in', // Zoho API base URL
  changeOrigin: true, // Changes the origin of the request to the target URL
  pathRewrite: { '^/zoho': '' }, // Removes the /zoho prefix from the path
  onProxyReq: (proxyReq) => {
    // Remove the Origin header (this is required by Zoho API)
    proxyReq.removeHeader('Origin')
  },
}

const zohoProxy = createProxyMiddleware(zohoOptions)

exports.handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    // Ensure the serverless function only handles /zoho requests
    if (event.path.startsWith('/zoho')) {
      const req = {
        url: event.path.replace('/.netlify/functions/proxy', ''), // Adjust the path
        method: event.httpMethod,
        headers: event.headers,
        body: Buffer.from(event.body || '', 'base64'),
      }

      const res = {
        writeHead: (statusCode, headers) => {
          resolve({
            statusCode,
            headers,
          })
        },
        end: (body) => {
          resolve({
            statusCode: 200,
            body: body ? body.toString() : '',
          })
        },
      }

      zohoProxy(req, res, (err) => {
        if (err) {
          reject({
            statusCode: 500,
            body: JSON.stringify({ error: 'Proxy error' }),
          })
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
