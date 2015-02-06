module.exports = function(_s){

    var pathsList = _s.oConfig.pathsList
        , router = require(pathsList.Router)
        , RoutMsg = require(pathsList.RoutMsg)(_s)
        , routMsg = new RoutMsg()
        , RoutRoom = require(pathsList.RoutRoom)(_s)
        , routRoom = new RoutRoom()
        , RoutRemoteMsg = require(pathsList.RoutRemoteMsg)(_s)
        , routRemoteMsg = new RoutRemoteMsg()
        ;

    function RoutChat (){
        router.apply(this,arguments);
    }

    RoutChat.prototype = Object.create(router.prototype);
    RoutChat.prototype.constructor = RoutChat;

    RoutChat.prototype.msg = routMsg.rout.bind(routMsg);

    RoutChat.prototype.rmMsg = routRemoteMsg.rout.bind(routRemoteMsg);

    RoutChat.prototype.room = routRoom.rout.bind(routRoom);


    return RoutChat;
};