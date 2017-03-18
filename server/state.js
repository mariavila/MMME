var db = require('./db');

var currentState = {};

/* AUX FUNCTIONS */

var deletePoints = function(route, routePoint) {
    var index = route.points.indexOf(routePoint);
    if (index > -1) {
        route.points = route.points.slice(index, -1);
    }
}

var isRouteFinished = function(route) {
    return route.points.length === 0;
}

/* STATE MANAGMENT */

var insertUserRoute = function(idUser, points, balance) {
    if(typeof currentState[idUser].info === "undefined") {
        getUserInfo(idUser);
    }
    currentState[idUser].route = {idUser : idUser, points : points, balance : balance};
}

var updatePoint = function(idUser, routePoint) {
    
    var route = currentState[idUser].route.points;
    deletePoints(route, routePoint);

    var ret = {lastPoint : false, balance : currentState[idUser].info.balance};

    if(isRouteFinished(route)) {
        var newBalance = currentState[idUser].route.balance + currentState[idUser].info.balance;
        ret = {lastPoint : true, balance : newBalance};
        setNewBalance(idUser, newBalance);
    }
    
    return ret;
}


/* USER MANAGMENT */

var getUserInfo = function(idUser) {

    var callback = function(err, result) {

        if(result.length === 0) {
            console.log("idUser does not exists, creating it: " + idUser);
            db.insertToDb("user", {id : idUser, balance : 0});
            return {idClient : idUser, balance : 0};
        }

        if(idUser !== result[0].id) {
            console.error("idUser does not match query id");
        }

        var info = {idCLient : result[0].id, balance : result[0].balance};

        currentState[idUser].info = info;
        return info;
    }

    db.getFromDb('user', callback);
}

var setNewBalance = function(idUser, balance) {
    
    var callback = function() {};

    var info = db.updateField('user', idUser, "balance", balance, callback);

}

exports.insertUserRoute = insertUserRoute;
exports.updatePoint = updatePoint;
exports.getUserInfo = getUserInfo;