var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

var state = require('./state');
var db = require('./db');
var stretch = require('./stretch');
var planner = require('./planner');

var myparser = require('./myparser');
app.use(express.static('public'));

app.set('views', __dirname + "/views");
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

myparser.parseMap();

db.connect();

//Server
http.listen(3000, function(){
 	console.log('listening on *:3000');
});

app.get('/login', function(req,res){
console.log(req.query);
  var user_id = req.query.id;
  console.log(user_id);
	state.getUserInfo(user_id, function(info){
		res.render('geocoding.html', info);
	});
});
//NO COMPROVAT
app.get('/initRoute', function(req, res){
    var pos_ini = {};
    var pos_fi = {};
    pos_ini.latitude = req.query.pos_ini_lat;
    pos_ini.longitude = req.query.pos_ini_lng;
    pos_fi.latitude = req.query.pos_fi_lat;
    pos_fi.longitude = req.query.pos_fi_lng;
	var user_id = req.query.id;
  console.log(req.query);
  state.clearRouteUser(user_id);
  var ret = stretch.getNearestStretchs(pos_ini,pos_fi);
  console.log('calling solver :' + JSON.stringify(ret));
  var route = planner.solve(ret.ini, ret.fi);
  console.log(route);

  var newRoute = [];
  var count = 0;
  for(var i in route.way) {
	if(count%5 == 0){
		newRoute.push(stretch.getParameter(route.way[i], "pos"));
	}
	count++;
  }

  	console.log(JSON.stringify(newRoute));
  
	res.render('index.html', {route : newRoute});
});

app.get('/getAllRoutes', function(req, res){
	var routes = [];
  for(var userskey in state.currentState){
	  var user = state.currentState[userskey];
	  var route = user.route;
	  var newRoute = [];
	  for(var i in route.way) {
			newRoute.push(stretch.getParameter(route.way[i], "pos"));
	  }
	  routes.push(newRoute);
  }
  res.json(routes);
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
