module.exports = function(_rf){

    var router = _rf.Router;

    function Chat (Primus, spark){
        router.call(this,Primus, spark);

        this.RoutMsg = new _rf.RoutMsg(Primus, spark);
        this.RoutRoom = new _rf.RoutRoom(Primus, spark);
    }

    Chat.prototype = Object.create(router.prototype);
    Chat.prototype.constructor = Chat;

    Chat.prototype.msg = function(spark,msg){
        this.RoutMsg.rout(spark,msg.d);
    };

    Chat.prototype.roomDo = function(spark, msg){
        this.RoutRoom.rout(spark, msg.d);
    };


    return Chat;
};