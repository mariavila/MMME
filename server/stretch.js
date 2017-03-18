var stretchs = {};
var lastId = 0;

var insert = function(pos, vmax, long, lanes, nextsStretchs) {
    
    var stretch = {id: lastId, pos : pos, vmax : vmax, long : long, 
        lanes : lanes, nextsStretchs : nextsStretchs};

    //calculate k constant
    var k = vmax * long * lanes/(3 * vmax/(16 * 3600/1000) + 3);
    stretch.k = k;

    stretchs[lastId] = stretch;
    lastId++;
}
exports.insert = insert;

var getPeople = function(idScretch, time) {
    
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