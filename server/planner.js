var Heap = require('heap');
var Stretch = require('./stretch.js');
const MEANSPEED = 40.0 * 3600 / 1000;

function totalCost(state, end) {
  return expectedCost(state, end) + state.cost;
}

function expectedCost(state,end) {
  var ipos = Stretch.getParameter(state.stretchId, "pos")
  var fpos = Stretch.getParameter(end, "pos")
  return distancef(ipos, fpos) * 1000 / MEANSPEED;
}


function distancef(loc1,loc2)
{
  return calcCrow(loc1.longitude, loc1.latitude, loc2.longitude, loc2.latitude);
}


var solve = function solve(begin,  end){
  var heap = new Heap(function(a, b) {
    return totalCost(a,end) - totalCost(b,end);
  });

  var firstState = {}:
  firstState.cost = 0;
  firstState.time = 0;
  firstState.stretchId = begin;
  firstState.way = [];
  heap.push(firstState);

  while(!heap.empty() && heap.peek() != end){
    var nowState = heap.pop();
    var succesors = Stretch.getParameter(nowState.stretchId, "nextsStretchs");
    for (succesorsKey in succesors)
    {
      var nextState = copy(nowState);
      nextState.stretchId = succesors[succesorsKey];
      nextState.time += Stretch.getTime(nextState.stretchId,nowState.time);
      if(Stretch.getParameter(nextState.stretchId, "vmax") >=  Stretch.getParameter(nextState.stretchId, "k") / Stretch.getPeople(nextState.stretchId,nowState.time)){
        //estem en congestio
        nextState.cost += Stretch.getTime(nextState.stretchId,nowState.time)
        + Stretch.getPeople(nextState.stretchId,nowState.time)
        * Stretch.getParameter(nextState.stretchId, "long") / Stretch.getParameter(nextState.stretchId, "k");
      } else
      {
        nextState.cost += Stretch.getTime(nextState.stretchId,nowState.time);
      }
      nextState.way.push(nowState.stretchId);
      heap.push(nextState);
    }
  }
  if ( !heap.empty() ) return heap.pop().way;
  return -1;
}


//generateas a copy
function copy(aux) {
  return(JSON.parse(JSON.stringify(aux)));
}


module.exports.solve = solve;

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


/////////////////test //////////////////
