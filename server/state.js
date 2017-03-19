var db = require('./db');
var stretch = require('./stretch');

var currentState = {};

/* AUX FUNCTIONS */

var deletePoints = function(route, routePoint) {
    var index = route.points.indexOf(routePoint);
    if (index > -1) {
        //clear points
        var deletedPoints =  route.points.slice(0, index + 1);
        stretch.clearRoute(route, deletedPoints);

        //update route points
        route.points = route.points.slice(index + 1, route.points.length);
    }
}

var isRouteFinished = function(route) {
    return route.points.length === 0;
}

/* STATE MANAGMENT */

var insertUserRoute = function(idUser, points, balance) {
    currentState[idUser].route = {idUser : idUser, points : points, balance : balance};
    console.log(currentState[idUser].route);
}

var updatePoint = function(idUser, routePoint) {
    
    var route = currentState[idUser].route;
    deletePoints(route, routePoint);

    var ret = {lastPoint : false, balance : currentState[idUser].info.balance};

    if(isRouteFinished(route)) {
        var newBalance = currentState[idUser].route.balance + currentState[idUser].info.balance;
        ret = {lastPoint : true, balance : newBalance};
        setNewBalance(idUser, newBalance);
    }
    
    return ret;
}

var clearRouteUser = function(idUser) {
    var points = currentState[idUser].route.points;
    stretch.clearRoute(idUser, points);
}



/* USER MANAGMENT */

var getUserInfo = function(idUser, done) {

    var callback = function(err, result) {

        if(result.length === 0) {
            console.log("idUser does not exists, creating it: " + idUser);
            db.insertToDb("user", {id : idUser, balance : 0});
            done({idClient : idUser, balance : 0});
            return;
        }

        if(idUser !== result[0].id) {
            console.error("idUser does not match query id");
        }

        var info = {idCLient : result[0].id, balance : result[0].balance};

        currentState[idUser] = {info : {}, route : {}};
        currentState[idUser].info = info;
        done(info);
    }

    db.getFromDb('user', idUser, callback);
}

var setNewBalance = function(idUser, balance) {
    
    var callback = function() {};

    var info = db.updateField('user', idUser, "balance", balance, callback);
}

exports.insertUserRoute = insertUserRoute;
exports.updatePoint = updatePoint;
exports.getUserInfo = getUserInfo;
exports.clearRouteUser = clearRouteUser;
