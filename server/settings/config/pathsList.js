/**
 * Created by yaniv-kalfa on 7/19/14.
 */
module.exports = function(_s){
    var serverDirname = _s.sServerDirname;
    var sharedDirname = _s.sSharedDirname;
    return {
        // modules
        "ajaxHandler" : serverDirname + '/lib/modules/ajaxHandler.js',
        "Authorization" : serverDirname + '/lib/modules/authorization.js',
        "GamesApi" : serverDirname + '/lib/modules/gamesApi.js',
        "GetRooms" : serverDirname + '/lib/modules/getRooms.js',
        "GetRoom" : serverDirname + '/lib/modules/getRoom.js',
        "HttpTransit" : serverDirname + '/lib/modules/httpTransit.js',
        "oReq" : serverDirname + '/lib/requiredFiles.js',
        "oRouts" : serverDirname + '/lib/requiredRouts.js',
        "oWebSockets" : serverDirname + '/lib/requiredWebSockets.js',
        "QueuesApi" : serverDirname + '/lib/modules/queuesApi.js',
        "QueueOut" : serverDirname + '/lib/modules/QueueOut.js',
        "RoomHandler" : serverDirname + '/lib/modules/roomHandler.js',
        "RoutMsg" : serverDirname + '/lib/modules/routMsg.js',
        "RoutRemoteMsg" : serverDirname + '/lib/modules/routRemoteMsg.js',
        "RoutRoom" : serverDirname + '/lib/modules/routRoom.js',
        "RoutChat" : serverDirname + '/lib/modules/routChat.js',
        "RoutSjax" : serverDirname + '/lib/modules/routSjax.js',
        "RoutQueue" : serverDirname + '/lib/modules/routQueue.js',
        "RoutSocket" : serverDirname + '/lib/modules/routSocket.js',
        "Servers" : serverDirname + '/lib/modules/servers.js',
        "SocketAjax" : serverDirname + '/lib/modules/socketAjax.js',
        "User" : serverDirname + '/lib/modules/user.js',
        "ValidationReg" : serverDirname + '/lib/modules/validationReg.js',

        // supers
        "Validation" : serverDirname + '/lib/modules/supers/validation.js',
        "Router" : serverDirname + '/lib/modules/supers/router.js',


        // shared
        "BasicUser" : sharedDirname + '/scripts/basicUser.js',
        "EventEmitter" : sharedDirname + '/scripts/eventEmitter.js',
        "List" : sharedDirname + '/scripts/list.js',
        "Queue" : sharedDirname + '/scripts/queue.js',
        "Queues" : sharedDirname + '/scripts/queues.js',
        "QueueUser" : sharedDirname + '/scripts/queueUser.js',
        "UserSuper" : sharedDirname + '/scripts/user.js',
        "UsersList" : sharedDirname + '/scripts/UsersList.js',
        "uf" : sharedDirname + '/scripts/utilFunc.js'

    };
};