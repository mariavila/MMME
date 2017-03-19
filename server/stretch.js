var sortedArray = require("sorted-array");

var stretchs = {};
var lastId = 0;

var orderStartDate = function(x, y) {
    return x.startTime - y.startTime;
}

var orderEndDate = function(x, y) {
    return x.endTime - y.endTime;
}

var insert = function(pos, vmax, long, lanes, nextsStretchs) {
    
    var stretch = {id: lastId, pos : pos, vmax : vmax, long : long, 
        lanes : lanes, nextsStretchs : nextsStretchs};

    //calculate k constant
    var k = vmax * long * lanes/(3 * vmax/(16 * 3600/1000) + 3);
    stretch.k = k;

    //add sorted start times
    stretch.orderStartDate = new sortedArray([], orderStartDate());
    //add soreted end times
    stretch.orderEndDate = new sortedArray([], orderEndDate());
    //add id map reference
    stretch.reference = {};

    stretchs[lastId] = stretch;
    lastId++;
}
exports.insert = insert;

var insertRoute = function(id, points) {
    //clear previous routes for this user
    clearRoute(id);

    var updateTime = 0;

    for(i in points) {
        var point = points[i];

        //add time
        var time = getTime(point, updateTime) + updateTime;

        //save new time
        var obj = {startTime : updateTime, endTime : time, idUser : id};
        stretch = stretchs[point];
        stretch.orderStartDate.insert(obj);
        stretch.orderEndDate.insert(obj);
        stretch.reference.id = obj;

        updateTime = time;
    }

    //propagate if wanted
}
exports.insertRoute = insertRoute;

var clearRoute = function(id) {

}
exports.clearRoute = clearRoute;

var deletePoint = function(id, idStretch) {

    var delObj = stretch.reference[id];
    var stretch = stretchs[idStretch]; 

    stretch.orderStartDate.remove(delObj);
    stretch.orderEndDate.remove(delObj);
    delete stretch.reference[id];
}

var getPeople = function(idScretch, time) {
    return 1;
}
exports.getPeople = getPeople;

var getParameter = function(idScretch, parameterName) {
    return stretchs[idScretch][parameterName];
}
exports.getParameter = getParameter;

var getTime = function(idScretch, time) {
    var numPeople = getPeople(idScretch, time);
    return long/min(vmax, k/numPeople);
}
exports.getTime = getTime;