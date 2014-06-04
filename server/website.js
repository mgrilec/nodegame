var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
var app = express();

app.use(express.static('../client'));

app.get('/', function(req, res) {
	res.redirect('/index.html');
});

module.exports = app.listen(3000);

console.log('view the example on http://127.0.0.1:3000');