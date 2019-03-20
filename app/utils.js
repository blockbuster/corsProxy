const axios = require("axios")


const fetchResponse = async (url, origin, method, data) => {
  const allow_methods = ['GET','PUT','POST','DELETE'];
  const allow_headers = ['accept', 'authorization', 'content-type','origin']
  const requestBody = {url: url, method: method }
  if (data) {
    requestBody["data"] = data 
  }
  console.log(requestBody)
  console.log(origin)
  const res = await axios(requestBody)
  .then((res) => {
     // res.headers['access-control-allow-origin'] = origin;
     res.headers['access-control-allow-origin'] = origin;
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

const serializeParams = async (params) => {
  let queryString = []
  // Check if any params are passed
  if (typeof params !== 'undefined') {
    await Object.keys(params).sort().map((q) => {
      queryString.push(q + '=' + params[q])
    })
  }
  return queryString.join('&')
  // return 'WEEE'
}

const transformEventData = (params, data) => {
  // Check if service url is set as param or in body
  let parsedData = {}
  try {
    parsedData = JSON.parse(data || '{}')
  }
  catch (e){
    console.log('Body can not be parsed')
  }
  let serviceURL = 'https://storefront.commerce.theplatform.eu'
  if (params && params.serviceURL) {
    serviceURL = params.serviceURL
    delete params['serviceURL']
  }
  else if (parsedData && parsedData.serviceURL) {
    serviceURL = parsedData.serviceURL
    delete parsedData[serviceURL]
  }
  return {
    data: parsedData,
    params: params,
    serviceURL: serviceURL,
  }
}

const sendServiceRequest = async (event) => {
  const origin = event.headers.origin || event.headers.Origin;
  const method = event.requestContext.httpMethod;
  const path = event.path;
  let params = event.queryStringParameters
  const eventData = transformEventData(params, event.body)
  const queryString = await serializeParams(eventData.params)
  const url = `${eventData.serviceURL}${path}/?${queryString}`
  const res = await fetchResponse(
    url,
    origin,
    method,
    eventData.data
  )
  return res
}

module.exports = {
  fetchResponse: fetchResponse,
  sendServiceRequest: sendServiceRequest,
  serializeParams: serializeParams,
  transformEventData: transformEventData,
}
