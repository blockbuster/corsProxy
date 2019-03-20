const utils = require('./utils.js');

exports.handler = async (event, context) => {
  const res = await utils.sendServiceRequest(event);
  console.log(JSON.stringify(res.data));
  return {
    headers: res.headers,
    statusCode: res.statusCode,
    body: JSON.stringify(res.data)
  };
};
