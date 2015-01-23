module.exports = function(_rf){

    var router = _rf.Router;

    function Chat (){
        router.apply(this,arguments);

        this.RoutMsg = new _rf.RoutMsg();
        this.RoutRoom = new _rf.RoutRoom();
    }

    Chat.prototype = Object.create(router.prototype);
    Chat.prototype.constructor = Chat;

    Chat.prototype.msg = function(spark,msg){
        this.RoutMsg.rout(spark,msg);
    };

    Chat.prototype.roomDo = function(spark, msg){
        this.RoutRoom.rout(spark, msg);
    };


    return Chat;
};