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


    RoutSocket.prototype.chat = function(spark, msg){
        return this.RoutChat.rout(spark, msg);
    };

    RoutSocket.prototype.sjax = function(spark, msg){
        return this.RoutSjax.rout(spark, msg);
    };

    RoutSocket.prototype.queue = function(spark, msg){
        console.log(msg);
        var data = {
            "m" : 'ready',
            "d" : {
                "queue" : msg.d.queue,
                "users" : msg.d.users
            }
        };

        spark.write({"m":'queue', d:{}});
        //return this.RoutSjax.rout(spark, msg);
    };


    return RoutSocket;
};