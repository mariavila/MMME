var sortedArray = require("sorted-array");

var stretchs = {};
var lastId = 0;

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

    stretchs[lastId] = stretch;
    lastId++;
}
exports.insert = insert;

var insertRoute = function(id, points) {
    //clear previous routes for this user

    var updateTime = 0;

    for(i in points) {
        var point = points[i];

        //calculate time
        var time = getTime(point, updateTime);

        //save new time
        var obj = {startTime : updateTime, endTime : updateTime + time, idUser : id};
        stretch.orderStartDate.insert(obj);
        stretch.orderEndDate.insert(obj);

        //move forward the clock
        updateTime += time;

    }

    //propagate if wanted
}

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
  while (index >= 0  && array[index].startTime >= time ) --index;
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
  while (index < array.length && array[index].endTime <= time ) ++index;
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
      while (index >= 0 && byEndDate[index].endTime == obj.endTime)
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
    if(numPeople == 0) numPeople = 1; //no vull dividir per 0
    return long/min(vmax, k/numPeople);
}
exports.getTime = getTime;


function copy(aux) {
  return(JSON.parse(JSON.stringify(aux)));
}
