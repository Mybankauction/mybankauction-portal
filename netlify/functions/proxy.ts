const { createProxyMiddleware } = require("http-proxy-middleware");

const zohoOptions = {
  target: "https://www.zohoapis.in", // Base API URL for Zoho
  changeOrigin: true,
  pathRewrite: { "^/zoho": "" }, // Remove '/zoho' from the path before forwarding
};

const tokenOptions = {
  target: "https://accounts.zoho.in", // Base API URL for Token
  changeOrigin: true,
  pathRewrite: { "^/token": "" }, // Remove '/token' from the path before forwarding
};

const zohoProxy = createProxyMiddleware(zohoOptions);
const tokenProxy = createProxyMiddleware(tokenOptions);

exports.handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    if (event.path.startsWith("/zoho")) {
      zohoProxy(event, context, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    } else if (event.path.startsWith("/token")) {
      tokenProxy(event, context, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    } else {
      resolve({
        statusCode: 404,
        body: "Not Found",
      });
    }
  });
};
