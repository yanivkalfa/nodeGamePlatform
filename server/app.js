var _s = {};
_s.oReq = require('./lib/requiredFiles.js')(_s); // require files.
_s.details = JSON.parse(_s.oReq.fs.readFileSync(__dirname + '/serverDetails.json').toString())[process.argv[2] || 'testSlave01'];
_s.sServerDirname = __dirname; // Server dir
_s.sClientDirname = _s.oReq.path.resolve(__dirname, '..') + '/client'; //Client dir
_s.sSharedDirname = _s.oReq.path.resolve(__dirname, '..') + '/shared'; //Client dir
_s.oConfig = require('./settings/config')(_s); // require config files.
global.oCore = require('./core')(_s); // require core files.

_s.oRouts = require('./lib/requiredRouts.js')(_s);
_s.oWebSockets = require('./lib/requiredWebSockets.js')(_s);

_s.oReq.http.listen(_s.details.port, function(){
    console.log('listening on *:' + _s.details.port);
});