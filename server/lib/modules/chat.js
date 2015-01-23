module.exports = function(_rf){

    var router = _rf.Router;

    function Chat (Primus, spark){
        router.call(this,Primus, spark);

        this.RouterMsg = new _rf.RouterMsg(Primus, spark);
        this.RouterRoom = new _rf.RouterRoom(Primus, spark);
    }

    Chat.prototype = Object.create(router.prototype);
    Chat.prototype.constructor = Chat;

    Chat.prototype.msg = function(msg){
        this.RouterMsg.rout(msg);
    };

    Chat.prototype.roomDo = function(msg){
        this.RouterRoom.rout(msg);
    };


    return Chat;
};