var _s = {};
_s.oReq = require('./lib/requiredFiles.js')(_s); // require files.
console.log('a');
_s.details = JSON.parse(_s.oReq.fs.readFileSync(__dirname + '/serverDetails.json').toString())[process.argv[2] || 'testSlave01'];
console.log('b');
_s.sServerDirname = __dirname; // Server dir
_s.sClientDirname = _s.oReq.path.resolve(__dirname, '..') + '/client'; //Client dir
_s.sSharedDirname = _s.oReq.path.resolve(__dirname, '..') + '/shared'; //Client dir
console.log('c');
_s.oConfig = require('./settings/config')(_s); // require config files.
console.log('d');
global.oCore = require('./core')(_s); // require core files.
console.log('e');
//_s.oModules = require('./lib/modules')(_s); // require utility functions

_s.oRouts = require('./lib/requiredRouts.js')(_s);
console.log('f');
_s.oWebSockets = require('./lib/requiredWebSockets.js')(_s);
console.log('g');

_s.oReq.http.listen(_s.details.port, function(){
    console.log('listening on *:' + _s.details.port);
});
/*
var servers = new _s.oModules.Servers();
var sName =  process.argv[2] || 'testSlave01';

if(sName.toLowerCase() == 'servers'){
    var filter = function(item, i){ return i !== 0 && i !== 1 && i !== 2; };
    var success = function(){process.exit(1)};
    var fail = function(err){
        console.log(err);
        process.exit(0)
    };
    servers.analys(process.argv.filter(filter)).then(success, fail).catch(fail);
}else{
    var startServer = function(server){
        if(!server) process.exit();

        _s.details = server;
        _s.oRouts = require('./lib/requiredRouts.js')(_s);
        _s.oWebSockets = require('./lib/requiredWebSockets.js')(_s);

        _s.oReq.http.listen(_s.details.port, function(){
            console.log('listening on *:' + _s.details.port);
        });
    };

    servers.fetchByName(sName).then(startServer).catch(console.log)

}
    */