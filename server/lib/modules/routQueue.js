module.exports = function(_s, _rf){

    var router = _rf.Router
        , _ = _s.oReq.lodash
        , User = _rf.User
        , HttpTransit = _rf.HttpTransit
        , Servers = _rf.Servers
        ;

    function RoutQueue (){
        router.apply(this,arguments);
    }

    RoutQueue.prototype = Object.create(router.prototype);
    RoutQueue.prototype.constructor = RoutQueue;

    RoutQueue.prototype.join = function(spark, msg){
        msg.room = 'madeUpRoomName';
        var data = {
            "m" : 'ready',
            "d" : msg
        };

        spark.write({"m":'queue', d:data});
    };

    RoutQueue.prototype.leave = function(spark, msg){
        var data = {
            "m" : 'ready',
            "d" : msg.d
        };

        spark.write({"m":'queue', d:data});
    };


    RoutQueue.prototype.ready = function(spark, msg){
        var data = {
            "m" : 'ready',
            "d" : msg.d
        };

        spark.write({"m":'queue', d:data});
    };
    RoutQueue.prototype.updatequeue = function(spark, msg){
        console.log(msg);
        /*
        var data = {
            "m" : 'ready',
            "d" : msg.d
        };

        spark.write({"m":'queue', d:data});
        */
    };




    return RoutQueue;

};