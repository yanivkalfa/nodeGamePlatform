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

    /*
    this.RoutMsg = new RoutMsg();
    this.RoutRoom = new RoutRoom();
    this.RoutRemoteMsg = new RoutRemoteMsg();
    */

    function RoutChat (){
        router.apply(this,arguments);
    }

    RoutChat.prototype = Object.create(router.prototype);
    RoutChat.prototype.constructor = RoutChat;

    RoutChat.prototype.msg = routMsg.rout.apply(routMsg);

    RoutChat.prototype.rmMsg = routRemoteMsg.rout.apply(routRemoteMsg);

    RoutChat.prototype.room = routRoom.rout.apply(routRoom);


    return RoutChat;
};