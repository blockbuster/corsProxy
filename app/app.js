const utils = require('./utils.js');

exports.handler = async (event) => {
  const res = await utils.sendServiceRequest(event);
  const method = event.requestContext.httpMethod;
  const origin = event.headers.origin||event.headers.Origin;
  res.headers['access-control-allow-origin'] = origin;

  res.headers['transfer-encoding'] =  '';
  if (method === 'OPTIONS'){
    res.statusCode = 200;
    res.headers['access-control-allow-origin'] = origin;
  }
  return {
    headers: res.headers,
    statusCode: res.statusCode,
    body: JSON.stringify(res.data)
  };
};
