module.exports = function(_s){

    var pathsList = _s.oConfig.pathsList
        , router = require(pathsList.Router)
        , QueueUser = require(pathsList.QueueUser)
        , GamesApi = require(pathsList.GamesApi)(_s)
        , GetRoom = require(pathsList.GetRoom)(_s)
        , getRoom = new GetRoom()
        , QueuesApi = require(pathsList.QueuesApi)(_s)
        , User = require(pathsList.User)(_s)
        , QueueOut = require(pathsList.QueueOut)(_s)
        , queueOut = new QueueOut()
        , _ = _s.oReq.lodash
        ;

    function RoutQueue (){
        router.apply(this,arguments);
    }

    RoutQueue.prototype = Object.create(router.prototype);
    RoutQueue.prototype.constructor = RoutQueue;

    RoutQueue.prototype.remoteJoinGameRoom = function(spark, msg){
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

    RoutQueue.prototype.joinGameRoom = function(spark, room){
        return new _s.oReq.Promise(function(resolve, reject) {
            spark.join(room, function(err, succ){
                if(err) return reject(err);
                return resolve(succ);
            });
        });
    };

    RoutQueue.prototype.leaveGameRoom = function(spark, room){
        return new _s.oReq.Promise(function(resolve, reject) {
            spark.leave(room, function(err, succ){
                return resolve(succ);
            });
        });
    };

    RoutQueue.prototype.checkQueues = function(spark, q){
        var self = this
            , qName = q.name
            ;
        QueuesApi.fetchSortLimit({"name" : qName}, 'date', q.userCount).then(function(queues){
            if(_.isArray(queues) && queues.length < q.userCount) return false;
            console.log('enough people queued');

            var users = []
                , remoteUsers = []
                , localUsers = []
                , roomName = qName
                , joinedPromises = []
                , fail
                ;


            var handleQueue = function(queue, index){
                var user = queue.user;
                roomName += '_' + user.id;
                users.push({
                    id:user.id,
                    username: user.username
                });
                var queueSpark  = _s.primus.spark(user.spark);

                if(!queueSpark) {
                    remoteUsers.push({user : user, spark : false, queue : queue});
                }else{
                    localUsers.push({user : user, spark : queueSpark, queue : queue});
                }
            };
            _(queues).forEach(handleQueue);
            _(queues).forEach(function(queue){
                queue.room = roomName;
                queue.save();
            });

            var qDetails = {
                id : user.queue.id,
                users : users,
                name:qName,
                room : roomName,
                userCount : q.userCount
            };
            _(localUsers).forEach(function(user){
                joinedPromises.push(self.joinGameRoom(user.spark, roomName));
            });

            _(remoteUsers).forEach(function(user){
                joinedPromises.push(self.joinGameRoom(user.spark, roomName));
            });

            fail = function(){
                _(localUsers).forEach(function(user){
                    self.leaveGameRoom(user.spark, roomName)
                });

                _(remoteUsers).forEach(function(user){
                    self.joinGameRoom(user.spark, roomName)
                });
            };

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


            //
            _s.oReq.Promise.all(joinedPromises).then(queueOut.ready.bind(queueOut, spark, qDetails), fail).catch(fail)
        });
    };
    RoutQueue.prototype._join = function(spark, msg){
        this.join(spark, msg, true);
    };

    RoutQueue.prototype.join = function(spark, msg, noStore){

        var self = this
            , qName = msg.name
            ;

        console.log('queue msg,', msg);
        if(noStore){
            queueOut.join(spark, msg);
            //return self.checkQueues(spark,msg);
        }

        return GamesApi.fetch(qName).then(function(game){
            if(!game) return queueOut.joinFail(spark, msg, 'You cannot play this game!');
            QueuesApi.fetch({"name" : qName, "user" : spark.user.id}).then(function(queue){
                if(queue) return queueOut.joinFail(spark, msg, 'You cannot queue for same game twice!');
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
                    msg.game = game._id;
                    queueOut.join(spark, msg);
                    //return self.checkQueues(spark,msg);
                });


            });
        }).catch(queueOut.joinFail.bind(queueOut,spark, msg));
    };

    RoutQueue.prototype.leave = function(spark, q){
        QueuesApi.remove(q.id).then(function(success){
            if(success) queueOut.leave(spark, q);
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