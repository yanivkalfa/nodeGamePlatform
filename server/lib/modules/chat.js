module.exports = function(_rf){

    var router = _rf.Router;

    function Chat (Primus, spark){
        router.call(this,Primus, spark);

        this.RoutMsg = new _rf.RoutMsg(Primus, spark);
        this.RoutRoom = new _rf.RoutRoom(Primus, spark);
    }

    Chat.prototype = Object.create(router.prototype);
    Chat.prototype.constructor = Chat;

    Chat.prototype.msg = function(msg){
        this.RoutMsg.rout(msg);
    };

    Chat.prototype.roomDo = function(msg){
        this.RoutRoom.rout(msg);
    };


    return Chat;
};