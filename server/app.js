var _s = {};
_s.details = JSON.parse(_s.oReq.fs.readFileSync(__dirname + '/serverDetails.json'))[process.argv[2] || 'testSlave01'];
_s.oReq = require('./lib/requiredFiles.js')(_s); // require files.
_s.sServerDirname = __dirname; // Server dir
_s.sClientDirname = _s.oReq.path.resolve(__dirname, '..') + '/client'; //Client dir
_s.oConfig = require('./settings/config'); // require config files.
global.oCore = require('./core')(_s); // require core files.
_s.oModules = require('./lib/modules')(_s); // require utility functions

_s.oRouts = require('./lib/requiredRouts.js')(_s);
_s.oWebSockets = require('./lib/requiredWebSockets.js')(_s);

_s.oReq.http.listen(_s.details.port, function(){
    console.log('listening on *:' + _s.details.port);
});




/*
var startServer = function(__dirname){
    console.log(server);
    _
};

var servers = new _s.oModules.Servers();
if(process.argv[2] && process.argv[2] == 'servers'){
    var filterArg = function(item, i){
        return i !== 0 && i !== 1 && i !== 2
    };
    var returned = servers.analys(process.argv.filter(filterArg));
    console.log(returned);
    process.exit();
}else{
    servers.fetchByName(process.argv[2] || 'testSlave01').then(startServer).catch(console.log);
}
    */