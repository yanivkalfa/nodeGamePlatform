module.exports = function(_s, _rf){

    var pathsList = _s.oConfig.pathsList
        //, router = _rf.Router
        , router = require(pathsList.Router)
        , RoutChat = require(pathsList.RoutChat)(_s)
        , RoutSjax = require(pathsList.RoutSjax)(_s)
        , RoutQueue = require(pathsList.RoutQueue)(_s)
        ;

    var validation = require(_s.oConfig.pathsList.HttpTransit)(_s);

    function RoutSocket (){
        router.apply(this,arguments);

        /*
        this.RoutChat = new _rf.RoutChat();
        this.RoutSjax = new _rf.RoutSjax();
        this.RoutQueue = new _rf.RoutQueue();
        */

        this.RoutChat = new RoutChat();
        this.RoutSjax = new RoutSjax();
        this.RoutQueue = new RoutQueue();
    }

    RoutSocket.prototype = Object.create(router.prototype);
    RoutSocket.prototype.constructor = RoutSocket;


    RoutSocket.prototype.chat = function(spark, msg){
        return this.RoutChat.rout(spark, msg);
    };

    RoutSocket.prototype.sjax = function(spark, msg){
        return this.RoutSjax.rout(spark, msg);
    };

    RoutSocket.prototype.queue = function(spark, msg){
        return this.RoutQueue.rout(spark, msg);
    };


    return RoutSocket;
};