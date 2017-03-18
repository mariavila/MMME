var fs = require('fs'),
    xml2js = require('xml2js');
 
var parser = new xml2js.Parser();
fs.readFile(__dirname + '/finalMap2.osm', function(err, data) {
    parser.parseString(data, function (err, result) {
        var nodeDict = {};
        var tramDict = {};
        for(var waykey in result.osm.way){
            var auxway = result.osm.way[waykey];
            //console.log(auxway);
            for (var i = 0; i < auxway.nd.length -1; ++i) {
                var newTram = {};
                var id = auxway.nd[i].$.ref + '-' + auxway.nd[i+1].$.ref;
                newTram.nodeI = auxway.nd[i].$.ref;
                newTram.nodeF = auxway.nd[i+1].$.ref;
                newTram.vmax = 30;
                newTram.lanes = 1;
                tramDict[id] = newTram;
                if ( auxway.nd[i].$.ref in nodeDict){
                    nodeDict[auxway.nd[i].$.ref].out.push(id);
                } else 
                {
                    var newNode = {};
                    newNode.out = [id];
                    nodeDict[auxway.nd[i].$.ref] = newNode;
                }
            }
        }

        for (var nodeKey in result.osm.node){
            var auxnode = result.osm.node[nodeKey].$;
            if (auxnode.id in nodeDict){
                nodeDict[auxnode.id].latitude = auxnode.lat;
                nodeDict[auxnode.id].longitude = auxnode.long;
            }
        }

        for(var tramkey in tramDict){
            tramDict[tramkey].
        }

        console.log('Done');
    });
});