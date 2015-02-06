module.exports = function(_s){

    var pathsList = _s.oConfig.pathsList
        , router = require(pathsList.Router)
        , QueueUser = require(pathsList.QueueUser)
        , GamesApi = require(pathsList.GamesApi)(_s)
        , GetRoom = require(pathsList.GetRoom)(_s)
        , getRoom = new GetRoom()
        , QueuesApi = require(pathsList.QueuesApi)(_s)
        , _ = _s.oReq.lodash
        //, RoutMsg = require(pathsList.RoutMsg)(_s)
        //, routMsg = new RoutMsg()
        ;

    function RoutQueue (){
        router.apply(this,arguments);
    }

    RoutQueue.prototype = Object.create(router.prototype);
    RoutQueue.prototype.constructor = RoutQueue;

    RoutQueue.prototype.ready = function(spark, msg){
        /* future use*/
    };

    RoutQueue.prototype.checkQueues = function(spark, msg){
        var self = this
            , qName = msg.queueName
            , joinResponse = function(method, warrning){
                if(warrning) msg.warrning = warrning;
                var data = {
                    "m" : method,
                    "d" : msg
                };

                return spark.write({"m":'queue', d:data});
            }
            ;

        GamesApi.fetchByQueueName(qName).then(function(game){
            if(!game) return joinResponse('joinFail','You cannot play this game!');


            QueuesApi.fetchSortLimit({"name" : qName}, 'date', game.userCount).then(function(queue){
                if(queue) return joinResponse('joinFail','You cannot queue for same game twice!');

                var qDetails = {
                    "out_id" : msg.id,
                    "name" : qName,
                    "room" : "",
                    "start" : new Date(),
                    "end" : "",
                    "game" : game._id,
                    "user" : spark.user.id
                };

                QueuesApi.add(qDetails).then(self.checkQueues.bind(self,spark,msg));
            });
        });









        var queue, end, roomName = spark.user.id + '_' + qName + '_';
        end = function(spark,rName){};

        qDetails = {
            id : msg.id,
            users : [],
            name:qName,
            userCount : game.userCount
        };

        //

        queue = spark.Queues.add(qDetails);

        getRoom.getSparksInRoom(qName).then(function(sparks){
            if(_.isArray(sparks) && sparks.length < game.userCount) return joinResponse('joinSuccess');
            var sparkId;
            _(sparks).forEach(function(spark_Id){
                if(spark_Id == spark.id) return true;
                sparkId = spark_Id;
                return false;
            });

            var queueUserSpark  = _s.primus.spark(sparkId);

            self.ready(spark, msg);
            if(queueUserSpark){
                self.ready(queueUserSpark, queue.getMinDetails());
            }

            // remote ready.
        })
    };

    RoutQueue.prototype.join = function(spark, msg){
        var self = this
            , qName = msg.queueName
            , joinResponse = function(method, warrning){
                if(warrning) msg.warrning = warrning;
                var data = {
                    "m" : method,
                    "d" : msg
                };

                return spark.write({"m":'queue', d:data});
            }
            ;

        GamesApi.fetchByQueueName(qName).then(function(game){
            if(!game) return joinResponse('joinFail','You cannot play this game!');
            QueuesApi.fetch({"name" : qName, "user" : spark.user.id}).then(function(queue){
                if(queue) return joinResponse('joinFail','You cannot queue for same game twice!');

                var qDetails = {
                    "out_id" : msg.id,
                    "name" : qName,
                    "room" : "",
                    "start" : new Date(),
                    "end" : "",
                    "game" : game._id,
                    "user" : spark.user.id
                };

                QueuesApi.add(qDetails).then(self.checkQueues.bind(self,spark,msg));
            });
        }).catch(joinResponse.bind(self, 'joinFail'));

        /*
        msg.room = 'madeUpRoomName';


        spark.join(msg.room, function(err, succ){
            var data = {
                "m" : 'ready',
                "d" : msg
            };

            spark.write({"m":'queue', d:data});
        });
        */
    };

    RoutQueue.prototype.leave = function(spark, msg){
        var data = {
            "m" : 'leave',
            "d" : msg
        };
        spark.write({"m":'queue', d:data});
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