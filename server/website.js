var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
var app = express();

app.use(express.static('../client'));
app.use(cookieParser('keyboard cat'));
app.use(session());

app.get('/', function(req, res) {
	res.redirect('/index.html');
});

// to implement reconnection should use connect.session.id as socket.io's id
app.get('/session', function(req, res) {
	var body = '';
	if (req.session.views) {
		++req.session.views;
	} else {
		req.session.views = 1;
		body += '<p>First time visiting? view this page in several browsers :)</p>';
	}
	res.send(body + '<p>viewed <strong>' + req.session.views + '</strong> times.</p>');
});

module.exports = app.listen(3000);

console.log('view the example on http://127.0.0.1:3000');