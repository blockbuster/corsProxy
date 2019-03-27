const utils = require('./utils.js');

exports.handler = async (event) => {
  const res = await utils.sendServiceRequest(event);
  console.log(JSON.stringify(res.data));

  const origin = event.headers.origin||event.headers.Origin;
  res.headers['access-control-allow-origin'] = origin;
  return {
    headers: res.headers,
    statusCode: res.statusCode,
    body: JSON.stringify(res.data)
  };
};
