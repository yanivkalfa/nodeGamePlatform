module.exports = function(_s, _rf){

    var router = _rf.Router
        , User = _rf.User
        ;

    function RoutSocket (){
        router.apply(this,arguments);
        this.RoutChat = new _rf.RoutChat();
        this.RoutSjax = new _rf.RoutSjax();
    }

    RoutSocket.prototype = Object.create(router.prototype);
    RoutSocket.prototype.constructor = RoutSocket;

    RoutSocket.prototype.ping = function(spark, data){
        //console.log(data);
        spark.write({"m": "ping", "d":"p"});
    };

    RoutSocket.prototype.chat = function(spark, msg){
        this.RoutChat.rout(spark, msg);
    };

    RoutSocket.prototype.sjax = function(spark, msg){
        this.RoutSjax.rout(spark, msg);
    };


    return RoutSocket;
};