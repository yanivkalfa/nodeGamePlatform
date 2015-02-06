module.exports = function(_s){

    var pathsList = _s.oConfig.pathsList
        , router = require(pathsList.Router)
        , RoutMsg = require(pathsList.RoutMsg)(_s)
        , RoutRoom = require(pathsList.RoutRoom)(_s)
        , RoutRemoteMsg = require(pathsList.RoutRemoteMsg)(_s)
        ;

    function RoutChat (){
        router.apply(this,arguments);

        this.RoutMsg = new RoutMsg();
        this.RoutRoom = new RoutRoom();
        this.RoutRemoteMsg = new RoutRemoteMsg();
    }

    RoutChat.prototype = Object.create(router.prototype);
    RoutChat.prototype.constructor = RoutChat;

    RoutChat.prototype.msg = function(spark,msg){
        return this.RoutMsg.rout.apply(this.RoutMsg,arguments);
    };

    RoutChat.prototype.rmMsg = function(spark, msg){
        console.log('rmMsg routing -> ');
        return this.RoutRemoteMsg.rout.apply(this.RoutRemoteMsg,arguments);
    };

    RoutChat.prototype.room = function(spark, msg){
        return this.RoutRoom.rout.apply(this.RoutRoom,arguments);
    };


    return RoutChat;
};