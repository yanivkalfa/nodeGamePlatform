module.exports = function(_rf){

    var router = _rf.router;

    function Chat (Primus, spark){
        router.call(this,Primus, spark);

        this.msgRouter = _s.oModules.msgRouter(_s.primus, spark);
        this.roomRouter = _s.oModules.roomRouter(_s.primus, spark);
    }

    Chat.prototype = Object.create(router.prototype);
    Chat.prototype.constructor = Chat;

    Chat.prototype.msg = function(msg){
        this.msgRouter.rout(msg);
    };

    Chat.prototype.roomDo = function(msg){
        this.roomRouter.rout(msg);
    };


    return Chat;
};