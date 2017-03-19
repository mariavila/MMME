var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

var state = require('./state');
var db = require('./db');
var stretch = require('./stretch');
var planner = require('./planner');
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
	state.getUserInfo(user_id, function(info){
		res.json(info);
	});
});
//NO COMPROVAT
app.get('/initRoute', function(req, res){
	var pos_ini = req.body.pos_ini;
	var pos_fi = req.body.pos_fi;
	var user_id = req.param('id');
  state.clearRouteUser(user_id);
  var ret = stretch.getNearestStretchs(pos_ini,pos_fi);
  var route = planner.solve(ret.ini, ret.fi);
	res.json(route);
});

app.post('/chooseRoute', function(req, res){
	var route = req.body.route;
	var user_id = req.param('id');
	var money = req.body.earned;
	state.insertUserRoute(user_id, route, money);
	res.json({status : "ok"});
});

app.post('/updateRoute',function(req, res){
	var point = req.body.point;
	var id = req.param('id');
	var info = state.updatePoint(id, point);
	res.json(info);
});
