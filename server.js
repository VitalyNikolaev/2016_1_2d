var express = require('express'),
    errorHandler = require('errorhandler'),
	bodyParser = require('body-parser'),
    app = express();

var request = require('request');
var HOSTNAME = 'localhost',
    PORT = 8080,
    PUBLIC_DIR = __dirname + '/public_html';

var counter = 0;

app
	.use('/', express.static(PUBLIC_DIR))
	.use(errorHandler())
	.use(bodyParser.urlencoded({ extended: true }))
	.use(bodyParser.json());

app.use(function (req, res, done) {
	console.log('Request #%s at %s \n\t URL: %s   method: %s \n\t body: ', ++counter, new Date(), req.url ,req.method);
	//console.log(req.body);
	done();
});

app.put('/api/session', function(req, res) {
	var username = req.body.login;
	var password = req.body.password;
	var newurl = 'http://localhost:80/api/session/';
	request({ url: newurl, method: 'PUT', json: {login: username, password: password}}).pipe(res);
});

app.put('/api/user', function(req, res) {
	var login = req.body.login;
	var password = req.body.password;
	var newurl = 'http://localhost:80/api/user';
	request({ url: newurl, method: 'PUT', json: {login: login, password: password}}).pipe(res);
});

app.delete('/api/session', function(req, res) {
	var newurl = 'http://localhost:80/api/session';
	request({ url: newurl, method: 'DELETE'}).pipe(res);
});

app.get('/api/session', function(req, res) {
	req.pipe(request('http://localhost:80' + req.url)).pipe(res);
});
app.get('/api/user/*',function(req,res) {
	req.pipe(request('http://localhost:80' + req.url)).pipe(res);
});
app.listen(PORT, function () {
	console.log("listening at http://%s:%s", HOSTNAME, PORT);
});

