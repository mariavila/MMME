var sortedArray = require("sorted-array");

var stretchs = {};

var orderStartDate = function(x, y) {
    return x.startTime - y.startTime;
}

var orderEndDate = function(x, y) {
    return x.endTime - y.endTime;
}

var insert = function(id, pos, vmax, long, lanes, nextsStretchs) {

    var stretch = {id: id, pos : pos, vmax : vmax, long : long,
        lanes : lanes, nextsStretchs : nextsStretchs};

    //calculate k constant
    var k = vmax * long * lanes/(3 * vmax/(16 / 3.6) + 3);
    stretch.k = k;

    //add sorted start times
    stretch.orderStartDate = new sortedArray([], orderStartDate);
    //add soreted end times
    stretch.orderEndDate = new sortedArray([], orderEndDate);
    //add id map reference
    stretch.reference = {};

    stretchs[id] = stretch;
}
exports.insert = insert;

var insertRoute = function(id, points) {
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

var clearRoute = function(id, deletedPoints) {
    for(var i in deletedPoints) {
        deletePoint(id, deletePoints[i]);
    }
}
exports.clearRoute = clearRoute;

var deletePoint = function(id, idStretch) {

    var delObj = stretch.reference[id];
    var stretch = stretchs[idStretch];

    stretch.orderStartDate.remove(delObj);
    stretch.orderEndDate.remove(delObj);
    delete stretch.reference[id];
}
exports.deletePoint = deletePoint;

//retorna el primer index que compleix array[index].startTime >= time
function dicotomicSearchS (array, value ){
  var high = array.length;
  var low  = 0;
  var index = 0;;
  while (high > low) {
      index = (high + low)/2;
      if (array[index].startTime < value) low  = index + 1;
      else if (array[index].startTime > value) high = index;
      else return high = low;
  }

  while (index >= 0  && index < array.length  && array[index].startTime >= time ) --index;
  ++index;
  return index;
}

//retorna l'ultim index que compleix array[index].endTime <= time
function dicotomicSearchE (array, value ){
  var high = array.length;
  var low  = 0;
  var index = 0;;
  while (high > low) {
      index = (high + low)/2;
      if (array[index].endTime < value) low  = index + 1;
      else if (array[index].endTime > value) high = index;
      else return high = low;
  }
  while (index >= 0  && index < array.length && array[index].endTime <= time ) ++index;
  --index;
  return index;
}

var getPeople = function(idScretch, time) {
    var byStartDate = copy(stretchs[idScretch].orderStartDate.array);
    byStartDate.splice(0,dicotomicSearchS(byStartDate,time));
    var byEndDate = copy(stretchs[idScretch].orderEndDate.array);
    byEndDate.splice(dicotomicSearchE(byEndDate,time));
    var numPeople = 0;
    for (var objKey in byStartDate)
    {
      var obj = byStartDate[objKey];
      var index = dicotomicSearchE(byEndDate, obj.endTime);
      while (index >= 0  && index < array.length && byEndDate[index].endTime == obj.endTime)
      {
        if ( obj == byEndDate[index] ){
          numPeople++;
        }
        --index;
      }
    }
    return numPeople;
}

exports.getPeople = getPeople;

var getParameter = function(idScretch, parameterName) {
    return stretchs[idScretch][parameterName];
}
exports.getParameter = getParameter;

var getTime = function(idScretch, time) {
    var numPeople = getPeople(idScretch, time);

    var stretch = stretchs[idScretch];

    if(numPeople == 0) numPeople = 0.001; //no vull dividir per 0
    return stretch.long/Math.min(stretch.vmax, stretch.k/numPeople);
}
exports.getTime = getTime;

var getNearestStretchs = function(pos_ini, pos_fi) {
  var sIni = {};
  var sFi = {};
  var first = true;
  for (var objKey in stretchs){
    var obj = stretchs[objKey];
    if (first){
      sIni.key = objKey;
      console.log(JSON.stringify(pos_ini) +"   " + JSON.stringify(obj) )
      sIni.distance = distancef(pos_ini, obj.pos);
      sFi.key = objKey;
      sFi.distance = distancef(pos_fi, obj.pos);
      first=false;
    }

    if (distancef(pos_ini, obj.pos) < sIni.distance){
      sIni.key = objKey;
      sIni.distance = distancef(pos_ini, obj.pos);
    }
    if(distancef(pos_fi, obj.pos) < sFi.distance){
      sFi.key = objKey;
      sFi.distance = distancef(pos_fi, obj.pos);
    }
  }
  console.log(JSON.stringify(sIni));
  var ret = {};
  ret.ini = sIni.key;
  ret.fi = sFi.key;
  return ret;
}

exports.getNearestStretchs = getNearestStretchs;

var getNearestStretch = function(pos_ini) {
  var sIni = {};
  var first = true;
  for (var objKey in stretchs){
    var obj = stretchs[objKey];
    if (first){
      sIni.key = objKey;
      sIni.distance = distancef(pos_ini, obj.pos);
    }
    if (distancef(pos_ini, obj.pos) < sIni.distance){
      sIni.key = objKey;
      sIni.distance = distancef(pos_ini, obj.pos);
    }
  }
  return sIni.key;
}

exports.getNearestStretch = getNearestStretch;


function distancef(loc1,loc2)
{
  return calcCrow(loc1.longitude, loc1.latitude, loc2.longitude, loc2.latitude);
}

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)

function calcCrow(lat1, lon1, lat2, lon2)
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians

function toRad(Value)
{
    return Value * Math.PI / 180;
}


function copy(aux) {
  return(JSON.parse(JSON.stringify(aux)));
}
