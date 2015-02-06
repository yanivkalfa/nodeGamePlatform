module.exports = function(_s){
    var pathsList = _s.oConfig.pathsList
        , router = require(pathsList.Router)
        , RoutChat = require(pathsList.RoutChat)(_s)
        , routChat = new RoutChat()
        , RoutSjax = require(pathsList.RoutSjax)(_s)
        , routSjax = new RoutSjax()
        , RoutQueue = require(pathsList.RoutQueue)(_s)
        , routQueue = new RoutQueue()
        ;

    /*
    this.RoutChat = new RoutChat();
    this.RoutSjax = new RoutSjax();
    this.RoutQueue = new RoutQueue();*/

    function RoutSocket (){
        router.apply(this,arguments);

    }

    RoutSocket.prototype = Object.create(router.prototype);
    RoutSocket.prototype.constructor = RoutSocket;


    RoutSocket.prototype.chat = routChat.rout.bind(routChat);

    RoutSocket.prototype.sjax = routSjax.rout.bind(routSjax);

    RoutSocket.prototype.queue = routQueue.rout.bind(routQueue);


    return RoutSocket;
};