module.exports = function(_s){

    var pathsList = _s.oConfig.pathsList
        , router = require(pathsList.Router)
        , Queue = require(pathsList.Queue)
        ;

    function RoutQueue (){
        router.apply(this,arguments);
    }

    RoutQueue.prototype = Object.create(router.prototype);
    RoutQueue.prototype.constructor = RoutQueue;

    RoutQueue.prototype.join = function(spark, msg){
        msg.room = 'madeUpRoomName';

        /*
        var self = this
            , queue = {
                id : Queues.createRequestId(),
                users : new QueueUser({id : self.Authorization.id, username : self.Authorization.username, accepted : false, isMe:true}),
                name:g.queueName,
                userCount : 2
            }
            , analysed
            , end = function(id){
                self.setGameImg(g);
            }
            ;
        queue = Queues.add(queue);
        */
        spark.join(msg.room, function(err, succ){
            var data = {
                "m" : 'ready',
                "d" : msg
            };

            spark.write({"m":'queue', d:data});
        });
    };

    RoutQueue.prototype.leave = function(spark, msg){
        var data = {
            "m" : 'leave',
            "d" : msg
        };
        spark.write({"m":'queue', d:data});
    };


    RoutQueue.prototype.ready = function(spark, msg){
        /* future use*/
    };

    RoutQueue.prototype.accept = function(spark, msg){

        var data = {
            "m" : 'accept',
            "d" : msg
        };
        _s.primus.room(msg.room).write({"m": "queue", "d":data});
    };

    RoutQueue.prototype.decline = function(spark, msg){
        var data = {
            "m" : 'decline',
            "d" : msg
        };
        _s.primus.room(msg.room).write({"m": "queue", "d":data});
    };




    return RoutQueue;

};