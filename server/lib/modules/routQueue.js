module.exports = function(_s){

    var pathsList = _s.oConfig.pathsList
        , router = require(pathsList.Router)
        , QueueUser = require(pathsList.QueueUser)
        , GamesApi = require(pathsList.GamesApi)(_s)
        , GetRoom = require(pathsList.GetRoom)(_s)
        , getRoom = new GetRoom()
        , QueuesApi = require(pathsList.QueuesApi)(_s)
        , User = require(pathsList.User)(_s)
        , _ = _s.oReq.lodash
        //, RoutMsg = require(pathsList.RoutMsg)(_s)
        //, routMsg = new RoutMsg()
        ;

    function RoutQueue (){
        router.apply(this,arguments);
    }

    RoutQueue.prototype = Object.create(router.prototype);
    RoutQueue.prototype.constructor = RoutQueue;

    RoutQueue.prototype.remoteReady = function(spark, msg){
        var sjaxRes = {
            "m":"sjax",
            "d" : {
                "m" : "res",
                "d" : {
                    "id" : sjaxId,
                    "d" :  {}
                }
            }
        };

        var toSpark  = _s.primus.spark(msg.spark);
        if(!toSpark) {
            sjaxRes.d.d.d = {s: false, d : 'Spark was not found'};
            spark.write(sjaxRes);
            return
        }

        toSpark.join(msg.room, function(err, succ){
            var data = {
                "m" : 'ready',
                "d" : msg
            };

            toSpark.write({"m":'queue', d:data});

            sjaxRes.d.d.d  = {s: true, d : 'Message sent successfully'};
            spark.write(sjaxRes);
        });

    };

    RoutQueue.prototype.ready = function(spark, msg){
        spark.join(msg.room, function(err, succ){
            var data = {
                "m" : 'ready',
                "d" : msg
            };

            spark.write({"m":'queue', d:data});
        });
    };

    RoutQueue.prototype.checkQueues = function(spark, q){
        var self = this
            , qName = q.name
            , joinResponse = function(method, warrning){
                if(warrning) msg.warrning = warrning;
                var data = {
                    "m" : method,
                    "d" : q
                };

                return spark.write({"m":'queue', d:data});
            }
            ;
        QueuesApi.fetchSortLimit({"name" : qName}, 'date', q.userCount).then(function(queues){
            console.log('queues', queues);
            if(_.isArray(queues) && queues.length < q.userCount) return false;

            console.log('got here fetchSortLimit');

            var users = []
                , remoteUsers = []
                , localUsers = []
                , roomName = qName
                ;


            var handleQueue = function(queue, index){
                var user = queue.user;
                roomName += '_' + user.id;
                users.push({
                    id:user.id,
                    username: user.name,
                    accepted: false,
                    isMe: false
                });
                var queueSpark  = _s.primus.spark(user.spark);

                if(!queueSpark) {
                    remoteUsers.push({user : user, spark : false, queue : queue});
                }else{
                    localUsers.push({user : user, spark : queueSpark, queue : queue});
                }
            };

            _(queues).forEach(handleQueue);


            console.log('localUsers', localUsers);
            console.log('remoteUsers: ', remoteUsers);
            _(localUsers).forEach(function(user){
                var qDetails = {
                    id : user.queue.out_id,
                    users : users,
                    name:qName,
                    room : roomName,
                    userCount : q.userCount
                };
                self.ready(user.spark, qDetails)
            });

            /*
             _(remoteUsers).forEach(function(user){
             // remote stuff
             var qDetails = {
             id : user.queue.out_id,
             users : users,
             name:qName,
             room : roomName,
             userCount : game.userCount,
             spark : user.spark
             };
             self.ready(user.spark, qDetails)
             });
             */
            //remoteReady

        });
    };
    RoutQueue.prototype._join = function(spark, msg){
        console.log('msg', msg);
        this.join(spark, msg, true);
    };

    RoutQueue.prototype.join = function(spark, msg, noStore){
        console.log('msg, noStore', msg, noStore);

        var self = this
            , qName = msg.name
            , joinResponse = function(method, warrning){
                if(warrning) msg.warrning = warrning;
                var data = {
                    "m" : method,
                    "d" : msg
                };

                return spark.write({"m":'queue', d:data});
            }
            ;

        if(noStore){
            joinResponse('join');
            return self.checkQueues(spark,msg);
        }

        console.log('qName', qName);
        return GamesApi.fetchByQueueName(qName).then(function(game){
            console.log('fetchByQueueName', game);
            if(!game) return joinResponse('joinFail','You cannot play this game!');
            QueuesApi.fetch({"name" : qName, "user" : spark.user.id}).then(function(queue){
                if(queue) return joinResponse('joinFail','You cannot queue for same game twice!');
                var qDetails = {
                    "name" : qName,
                    "room" : "",
                    "start" : new Date(),
                    "end" : "",
                    "game" : game._id,
                    "user" : spark.user.id
                };

                QueuesApi.add(qDetails).then(function(q){
                    msg.id = q.id;
                    joinResponse('join');
                    self.checkQueues(spark,msg);
                });


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

    RoutQueue.prototype.leave = function(spark, q){
        console.log(q);
        QueuesApi.remove(q.id).then(function(success){
            console.log('success', success);
            var data = {
                "m" : 'leave',
                "d" : q
            };
            spark.write({"m":'queue', d:data});
        });
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