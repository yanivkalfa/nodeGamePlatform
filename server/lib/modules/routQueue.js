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
        , SocketAjax = _s.oSocketAjax
        , _ = _s.oReq.lodash
        ;

    function RoutQueue (){
        router.apply(this,arguments);
    }

    RoutQueue.prototype = Object.create(router.prototype);
    RoutQueue.prototype.constructor = RoutQueue;

    RoutQueue.prototype.remoteJoinGameRoom = function(spark, msg, sjaxId){
        this.remoteActions(spark, msg, sjaxId, 'join');
    };

    RoutQueue.prototype.remoteLeaveGameRoom = function(spark, msg, sjaxId){
        this.remoteActions(spark, msg, sjaxId, 'leave');
    };

    RoutQueue.prototype.remoteActions = function(spark, msg, sjaxId, action){
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

        toSpark[action](msg.room, function(err, succ){

            if(err){
                sjaxRes.d.d.d = {"s": false, "d" : 'Could not join this room!'};
            }else{
                sjaxRes.d.d.d  = {"s": true, "d" : 'Joined room successful!'};
            }

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
                    remoteUsers.push({user : user, spark : user.spark, queue : queue});
                }else{
                    localUsers.push({user : user, spark : queueSpark, queue : queue});
                }
            };

            _(queues).forEach(handleQueue);
            _(queues).forEach(function(queue){
                queue.room = roomName;
                queue.occupied = true;
                queue.save();
            });

            var qDetails = {
                game : q.game,
                users : users,
                name:qName,
                room : roomName,
                userCount : q.userCount
            };
            _(localUsers).forEach(function(localUser){
                joinedPromises.push(self.joinGameRoom(localUser.spark, roomName));
            });

            _(remoteUsers).forEach(function(remoteUser){
                console.log('inside remoteUsers');
                var sjaxDetails = {
                    "server" : remoteUser.user.server,
                    "data" : {
                        "m": "queue",
                        "d": {
                            "m" : 'remoteJoinGameRoom',
                            "d" : {"room": roomName, "spark" : remoteUser.spark}
                        }
                    }
                };
                joinedPromises.push(SocketAjax.sJax(sjaxDetails));
            });

            fail = function(){
                /*
                _(localUsers).forEach(function(localUser){
                    self.leaveGameRoom(localUser.spark, roomName);
                });

                _(remoteUsers).forEach(function(remoteUser){
                    var sjaxDetails = {
                        "server" : remoteUser.user.server,
                        "data" : {
                            "m": "queue",
                            "d": {
                                "m" : 'remoteLeaveGameRoom',
                                "d" : {"room": roomName, "spark" : remoteUser.spark}
                            }
                        }
                    };
                    joinedPromises.push(SocketAjax.sJax(sjaxDetails));
                });
                */
            };

            //_s.oReq.Promise.all(joinedPromises).then(queueOut.ready.bind(queueOut, spark, qDetails), fail).catch(fail)
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
            return self.checkQueues(spark,msg);
        }

        return GamesApi.fetchByQueueName(qName).then(function(game){
            if(!game) return queueOut.joinFail(spark, msg, 'You cannot play this game!');
            QueuesApi.fetch({"name" : qName, "user" : spark.user.id}).then(function(queues){
                if(queues.length > 0) return queueOut.joinFail(spark, msg, 'You cannot queue for same game twice!');
                var qDetails = {
                    "name" : qName,
                    "room" : "",
                    "start" : new Date(),
                    "end" : "",
                    "game" : game.id,
                    "user" : spark.user.id
                };

                QueuesApi.add(qDetails).then(function(q){
                    msg.id = q.id;
                    msg.game = game.id;
                    queueOut.join(spark, msg);
                    return self.checkQueues(spark,msg);
                });


            });
        }).catch(queueOut.joinFail.bind(queueOut,spark, msg));
    };

    RoutQueue.prototype.leave = function(spark, q){
        QueuesApi.remove(q.id).then(function(success){
            console.log(success);
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