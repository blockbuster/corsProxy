const axios = require("axios");
var proxy_port = 8080;
var service_url = 'https://storefront.commerce.theplatform.eu';
// var service_url = 'https://data.entertainment.tv.theplatform.eu'


const fetchResponse = async (url, origin, method, data) => {
  const allow_methods = ['GET','PUT','POST','DELETE'];
  const allow_headers = ['accept', 'authorization', 'content-type','origin']
  const requestBody = {
    url: url, method: method }
  if (data) {
    requestBody["data"] = JSON.stringify(data)
  }
  const res = await axios(requestBody)
  .then((res) => {    
     // res.headers['access-control-allow-origin'] = origin;
     res.headers['Access-Control-Allow-Origin'] = origin;
     console.log('setting origin to: ', origin)
     res.headers['Access-Control-Allow-Methods'] = allow_methods.join(',') 
     res.headers['Access-Control-Allow-Headers'] = allow_headers.join(',')
     delete res.headers["content-length"]
     if (method === 'OPTIONS'){
        res.statusCode = 200
      }
      return res
  })
    .catch((err)=> {
      return err.response 
    })
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
  if (path === '/favicon.ico') {return {}}
  const params = event.queryStringParameters
  const data = event.body
  let queryString = await seriealize(params); 


  const url = `${service_url}${path}/?${queryString}`
  const res = await fetchResponse(
    url, 
    origin, 
    method, 
    data
  )


  return {
      headers: res.headers, 
      statusCode: res.statusCode, 
      body: JSON.stringify(res.data)
  }
  // return payload
}
