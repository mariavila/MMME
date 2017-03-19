var fs = require('fs'),
    xml2js = require('xml2js');


    var stretch = require('./stretch');

var parser = new xml2js.Parser();
var parseMap = fs.readFile(__dirname + '/finalMap2.osm', function(err, data) {
    parser.parseString(data, function (err, result) {
        var nodeDict = {};
        var tramDict = {};

        //First Loop, setting some constants and creating nodes
        for(var waykey in result.osm.way){
            var auxway = result.osm.way[waykey];
            var vmax = 0;
            var lanes = 1;
            var dual = false;

            for (var i = 0; i < auxway.tag.length; ++i){
                if (auxway.tag[i].$.k == "highway") {
                    if (auxway.tag[i].$.v == "residential" && vmax == 0) vmax = 30;
                }
                if (auxway.tag[i].$.k == "lanes") lanes = auxway.tag[i].$.v;
                if (auxway.tag[i].$.k == "maxspeed") vmax = auxway.tag[i].$.v;
                if (auxway.tag[i].$.k == "oneway" && auxway.tag[i].$.v == "yes") {dual = true; console.log("yee");}
            }
            if (vmax == 0) vmax = 50;

            for (var i = 0; i < auxway.nd.length -1; ++i) {
                var newTram = {};
                var id = auxway.nd[i].$.ref + '-' + auxway.nd[i+1].$.ref;

                newTram.nodeI = auxway.nd[i].$.ref;
                newTram.nodeF = auxway.nd[i+1].$.ref;
                newTram.vmax = vmax;
                newTram.lanes = lanes;
                tramDict[id] = newTram;
                if (auxway.nd[i].$.ref in nodeDict){
                    nodeDict[auxway.nd[i].$.ref].out.push(id);
                } else
                {
                    var newNode = {};
                    newNode.out = [id];
                    nodeDict[auxway.nd[i].$.ref] = newNode;
                }
            }

            if (!(auxway.nd[auxway.nd.length -1].$.ref in nodeDict)){
                    var newNode = {};
                    newNode.out = [];
                    nodeDict[auxway.nd[auxway.nd.length -1].$.ref] = newNode;
            }
        }

        //Second Loop, setting latitudes and longitudes of the nodes
        for (var nodeKey in result.osm.node){
            var auxnode = result.osm.node[nodeKey].$;
            if (auxnode.id in nodeDict){
                nodeDict[auxnode.id].latitude = auxnode.lat;
                nodeDict[auxnode.id].longitude = auxnode.lon;
            }
        }

        //Third and last Loop, completing the info in TramDict
        for(var tramkey in tramDict){
            var node1 = nodeDict[tramDict[tramkey].nodeI];
            var node2 = nodeDict[tramDict[tramkey].nodeF];

            var distance = getDistanceFromLatLonInM(node1.latitude, node1.longitude, node2.latitude, node2.longitude);
            var lat = (node1.latitude + node2.latitude)/2;
            var long = (node1.longitude + node2.longitude)/2;

            tramDict[tramkey].distance = distance;
            tramDict[tramkey].latitude = lat;
            tramDict[tramkey].longitude = long;

            tramDict[tramkey].out = node2.out;
        }

        console.log('Done');
    });
});

function getDistanceFromLatLonInM(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c * 1000; // Distance in m
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

exports.parseMap = parseMap;
