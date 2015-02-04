module.exports = function(_s, _rf){

    var router = _rf.Router;

    function RoutChat (){
        router.apply(this,arguments);

        this.RoutMsg = new _rf.RoutMsg();
        this.RoutRoom = new _rf.RoutRoom();
        this.RoutRemoteMsg = new _rf.RoutRemoteMsg();
    }

    RoutChat.prototype = Object.create(router.prototype);
    RoutChat.prototype.constructor = RoutChat;

    RoutChat.prototype.msg = function(spark,msg){
        return this.RoutMsg.rout(spark,msg);
    };

    RoutChat.prototype.rmMsg = function(spark, msg){
        console.log('rmMsg routing -> ');
        return this.RoutRemoteMsg.rout(spark, msg);
    };

    RoutChat.prototype.room = function(spark, msg){

        console.log('room routing -> ');
        return this.RoutRoom.rout(spark, msg);
    };


    return RoutChat;
};