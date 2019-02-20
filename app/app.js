var express = require('express');
var request = require('request');
var process = require('process');

var proxy_port = 8080;
var service_url = 'https://storefront.commerce.theplatform.eu';
var app = express();

app.use('/', function(req, res) {

    var url = service_url + req.url;
    var newReq = request(url);

    req.pipe(newReq).on('response', function(res) {
        var origin = req.headers.origin;

        // Let's dump some info about the request
        console.log('URL:', url);
        console.log('Method: ', req.method);
        console.log('Status: ', res.statusCode);
        console.log('Origin: ', origin);

        // Change headers to satisfy CORS
        // change the Access-Control-Allow-Origin from '*' to the Origin
        // needed by NetCast's old webkit (this version of webkit does not interpret the asterix as a wildcard but as a
        // string and tries to compare it with the origin hence rejecting the request)
        res.headers['Access-Control-Allow-Origin'] = origin;
        res.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE';
        res.headers['Access-Control-Allow-Headers'] = 'accept, authorization, content-type, origin';
		if(req.method === 'OPTIONS')
		{
			res.statusCode = 200;
		}
    }).pipe(res);
});

process.on('uncaughtException', function(err) {
    console.error('Caught exception: ' + err);
});

app.listen(proxy_port);
console.info('Listening on', proxy_port);