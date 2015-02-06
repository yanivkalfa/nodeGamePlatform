module.exports = function(_s){
    var pathsList = _s.oConfig.pathsList
        , router = require(pathsList.Router)
        , RoutChat = require(pathsList.RoutChat)(_s)
        , RoutSjax = require(pathsList.RoutSjax)(_s)
        , RoutQueue = require(pathsList.RoutQueue)(_s)
        ;

    function RoutSocket (){
        router.apply(this,arguments);
        this.RoutChat = new RoutChat();
        this.RoutSjax = new RoutSjax();
        this.RoutQueue = new RoutQueue();
    }

    RoutSocket.prototype = Object.create(router.prototype);
    RoutSocket.prototype.constructor = RoutSocket;


    RoutSocket.prototype.chat = function(spark, msg){
        return this.RoutChat.rout.apply(this.RoutChat,arguments);
    };

    RoutSocket.prototype.sjax = function(spark, msg){
        return this.RoutSjax.rout.apply(this.RoutSjax,arguments);
    };

    RoutSocket.prototype.queue = function(spark, msg){
        return this.RoutQueue.apply(this.RoutQueue,arguments);
    };


    return RoutSocket;
};