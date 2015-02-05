/**
 * Created by yaniv-kalfa on 7/19/14.
 */
module.exports = function(_s){
    var serverDirname = _s.sServerDirname;
    return {
        "oReq" : serverDirname + '/lib/requiredFiles.js',
        "oRouts" : serverDirname + '/lib/requiredRouts.js',
        "oWebSockets" : serverDirname + '/lib/requiredWebSockets.js',
        "uf" : serverDirname + '/',
        "GamesApi" : serverDirname + '/',
        "SocketAjax" : serverDirname + '/lib/modules/socketAjax.js',
        "HttpTransit" : serverDirname + '/lib/modules/httpTransit.js',
        "User" : serverDirname + '/lib/modules/user.js',
        "Servers" : serverDirname + '/lib/modules/servers.js',
        "Authorization" : serverDirname + '/lib/modules/authorization.js',
        "ValidationReg" : serverDirname + '/lib/modules/validationReg.js',
        "ajaxHandler" : serverDirname + '/lib/modules/ajaxHandler.js',
        "RoomHandler" : serverDirname + '/lib/modules/roomHandler.js',
        "GetRooms" : serverDirname + '/lib/modules/getRooms.js',
        "GetRoom" : serverDirname + '/lib/modules/getRoom.js',
        "RoutMsg" : serverDirname + '/lib/modules/routMsg.js',
        "RoutRemoteMsg" : serverDirname + '/lib/modules/routRemoteMsg.js',
        "RoutRoom" : serverDirname + '/lib/modules/routRoom.js',
        "RoutChat" : serverDirname + '/lib/modules/routChat.js',
        "RoutQueue" : serverDirname + '/lib/modules/routQueue.js',
        "RoutSocket" : serverDirname + '/lib/modules/routSocket.js',
        "Validation" : serverDirname + '/lib/modules/supers/validation.js',
        "Router" : serverDirname + '/lib/modules/supers/router.js'
    };
};