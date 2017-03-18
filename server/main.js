var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(http);

var state = require('./state');
var db = require('./db');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

db.connect();

//Server
http.listen(3000, function(){
 	console.log('listening on *:3000');
});