module.exports = function(_s, _rf){

    var router = _rf.router
        , _ = _s.oReq.lodash
        ;

    function Chat (_s, Primus, spark){
        router.call(this,_s, Primus, spark);

        this.msgRouter = _s.oModules.msgRouter(_s, _s.primus, spark);
        this.roomRouter = _s.oModules.roomRouter(_s, _s.primus, spark);
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