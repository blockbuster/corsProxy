const request = require('request')
var proxy_port = 8080;
var service_url = 'https://storefront.commerce.theplatform.eu';

const requestMethods  = {
  'GET': request.get,
  'POST': request.post,
  'PUT': request.put,
  'OPTIONS': request.options,
  'DELETE': request.delete

}


const fetchResponse = async (url, req, origin, method) => {
  const res = await req(url, (res) =>{

  res.headers['Access-Control-Allow-Origin'] = origin;
  res.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE';
  res.headers['Access-Control-Allow-Headers'] = 'accept, authorization, content-type, origin';
  if (method === 'OPTIONS')
    res.statusCode = 200
  })
  console.log(res)
  return res
  

}

const seriealize = async (params) => {
  let queryString = []
  await Object.keys(params).map((q) => {
    queryString.push(q + '=' + params[q])
  })
  return queryString.join('&')

}
exports.handler = async (event, context) => {
  const origin = event.headers.Origin;
  let header = {};
  const method = event.requestContext.httpMethod;
  const path = event.path;
  const params = event.queryStringParameters

  let queryString = await seriealize(params); 

  const url = `${service_url}${path}/?${queryString}`
  console.log(url)
  const res = await fetchResponse(
    url, 
    requestMethods[method], 
    origin, 
    method
  )
  // console.log(event)
  return res
}
