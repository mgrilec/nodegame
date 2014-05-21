var express = require('express');
var app = express();

app.use(express.static('../client'));
app.get('/', function(req, res) {
	res.redirect('/index.html');
});

module.exports = app.listen(3000);