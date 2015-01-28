var _s = {};
_s.oReq = require('./lib/requiredFiles.js')(_s); // require files.
_s.sServerDirname = __dirname; // Server dir
_s.sClientDirname = _s.oReq.path.resolve(__dirname, '..') + '/client'; //Client dir
_s.oConfig = require('./settings/config'); // require config files.
global.oCore = require('./core')(_s); // require core files.
_s.oModules = require('./lib/modules')(_s); // require utility functions

var Servers = new _s.oModules.Servers();
var sName =  process.argv[2] || 'testSlave01';

if(sName.toLowerCase() == 'servers'){
    var filter = function(item, i){ return i !== 0 && i !== 1 && i !== 2; };
    Servers.analys(process.argv.filter(filter));
    process.exit();
}else{

    var startServer = function(server){
        if(!server) return false;

        _s.details = server;
        _s.oRouts = require('./lib/requiredRouts.js')(_s);
        _s.oWebSockets = require('./lib/requiredWebSockets.js')(_s);

        _s.oReq.http.listen(_s.details.port, function(){
            console.log('listening on *:' + _s.details.port);
        });
    };

    Servers.fetchByName(sName).then(startServer).catch(console.log)

}