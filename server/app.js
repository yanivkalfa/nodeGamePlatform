
console.log(process.argv);
return
var _s = {};
_s.oReq = require('./lib/requiredFiles.js')(_s); // require files.
_s.sServerDirname = __dirname; // Server dir
_s.sClientDirname = _s.oReq.path.resolve(__dirname, '..') + '/client'; //Client dir
_s.oConfig = require('./settings/config'); // require config files.
global.oCore = require('./core')(_s); // require core files.
_s.oModules = require('./lib/modules')(_s); // require utility functions
_s.oRouts = require('./lib/requiredRouts.js')(_s);

var startServer = function(server){
    _s.details = server;
    _s.oWebSockets = require('./lib/requiredWebSockets.js')(_s);

    _s.oReq.http.listen(_s.details.port, function(){
        console.log('listening on *:' + _s.details.port);
    });
};

var Servers = new _s.oModules.Servers();
Servers.fetchByName(process.argv[2] || 'testSlave01').then(startServer).catch(console.log);

