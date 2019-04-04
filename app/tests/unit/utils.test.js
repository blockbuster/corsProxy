/**
 * @jest-environment node
 */
// The above lines enables cross domain post
const utils = require('../../utils.js');
const fs = require('fs');

// Default service URL
const defaultServiceURL = 'https://storefront.commerce.theplatform.eu';
// Param/body serviceURL;
const serviceURL = 'www.google.dk';
const serviceURL2 = 'www.bing.dk';

// Test Cases:

// GET
describe('Testing requests using GET method', () => {
  // Event fixture
  var event = JSON.parse(fs.readFileSync('./tests/unit/fixtures/get.json', 'utf8'));
  // correct path with service url in params
  test('GET, service url in params', () => {
    let params = event.queryStringParameters;
    // Add service URL to params
    params['serviceURL'] = serviceURL;
    let eventData = utils.transformEventData(params, event.body);
    expect(eventData.serviceURL).toBe(serviceURL);
  });
  // correct path without service url in params
  test('GET, service URL not in params', () => {
    let eventData = utils.transformEventData(event.params, event.body);
    expect(eventData.serviceURL).toBe(defaultServiceURL);
  });
  test('GET, service url in params and in body, param has precedence', () => {
    let params = event.queryStringParameters;
    // Add service URL to params
    params['serviceURL'] = serviceURL;
    let body = `{"serviceURL": ${serviceURL2}}`;
    let eventData = utils.transformEventData(params, body);
    expect(eventData.serviceURL).toBe(serviceURL);
  });
});

// POST
describe('Testing requests using POST method', () => {
  var event = JSON.parse(fs.readFileSync('./tests/unit/fixtures/post.json', 'utf8'));
  // correct path with service url in params
  test('POST, service url in body', () => {
    let body = '{"serviceURL": "www.google.dk"}';
    let eventData = utils.transformEventData(event.params, body);
    expect(eventData.serviceURL).toBe(serviceURL);
  });
  // correct path without service url in params
  test('POST, service URL not in body', () => {
    let eventData = utils.transformEventData(event.params, event.body);
    expect(eventData.serviceURL).toBe(defaultServiceURL);
  });
  test('POST, service url in body and in params, param has prcedence', () => {
    let params = event.queryStringParameters;
    // Add service URL to params
    params['serviceURL'] = serviceURL2;
    let body = `{"serviceURL": ${serviceURL}}`;
    let eventData = utils.transformEventData(params, body);
    expect(eventData.serviceURL).toBe(serviceURL2);
  });
});

// Test param serializer
test('No params', async () => {
  expect.assertions(1);
  let serializedParams = await utils.serializeParams({});
  expect(serializedParams).toBe('');
});
// Test param serializer
test('With params', async () => {
  expect.assertions(1);
  const params = {
    param1: 1,
    param2: 2,
    param3: '3%7Cdec'
  };
  let serializedParams = await utils.serializeParams(params);
  expect(serializedParams).toBe('param1=1&param2=2&param3=3|dec');
});

// Test endpoint documentation
// https://github.com/typicode/jsonplaceholder
// Endpoint test, GET
test('GET, service url in params', async () => {
  let event = JSON.parse(fs.readFileSync('./tests/unit/fixtures/get.json', 'utf8'));
  // Add service URL to params
  event.path = '/posts';
  event.queryStringParameters['serviceURL'] = 'https://jsonplaceholder.typicode.com';
  let res = await utils.sendServiceRequest(event);
  expect(Object.keys(res.data).length).toBe(100);
});

// Endpoint test, POST
test('GET, service url in params', async () => {
  let event = JSON.parse(fs.readFileSync('./tests/unit/fixtures/post.json', 'utf8'));
  event.path = '/posts';
  // Add required data and serviceURL to body
  event.body = JSON.stringify({
    title: 'foo',
    body: 'bar',
    userid: 1,
    serviceURL: 'https://jsonplaceholder.typicode.com'
  });
  let res = await utils.sendServiceRequest(event);
  expect(typeof res.data.id).toBe('number');
});


