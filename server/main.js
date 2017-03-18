var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

var state = requiere('./state');
var db = require('./db');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

db.connect();

//Server
http.listen(3000, function(){
 	console.log('listening on *:3000');
});

app.get('/login', function(req,res){
	var user_id = req.param('id');
	///////////getUserInfo(user_id);
});

app.get('/initRoute', function(req, res){
	var pos_ini = req.param('pos_ini');
	var pos_fi = req.param('pos_fi');
	var user_id = req.param('id');
	/*MARC calcula la ruta*/
	-->send routes to frontend 
});

app.get('/chooseRoute', function(req, res){
	var route = req.param('route');
	var id = req.param('id');
	var id = req.param('earned');
	//////////////
});

app.get()