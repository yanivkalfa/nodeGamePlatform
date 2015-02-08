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
            "id" : sjaxId,
            "d" :  {}
        };

        var toSpark  = _s.primus.spark(msg.spark);
        if(!toSpark) {
            sjaxRes.d = {s: false, d : 'Spark was not found'};
            spark.write(sjaxRes);
            return
        }

        toSpark[action](msg.room, function(err, succ){

            if(err){
                sjaxRes.d = {"s": false, "d" : 'Could not join this room!'};
            }else{
                sjaxRes.d  = {"s": true, "d" : 'Joined room successful!'};
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
                , userOffline
                ;

            var handleQueue = function(queue, index){
                var user = queue.user;
                roomName += '_' + user.id;
                users.push({
                    id:user.id,
                    username: user.username
                });
                var queueSpark  = _s.primus.spark(user.spark);
                if(!queueSpark && (_s.details.address != user.server.address || _s.details.port != user.server.port)) {
                    remoteUsers.push({user : user, spark : user.spark, queue : queue});
                }else if(queueSpark && _s.details.address == user.server.address && _s.details.port == user.server.port){
                    localUsers.push({user : user, spark : queueSpark, queue : queue});
                }else{
                    userOffline = true;
                }
            };

            _(queues).forEach(handleQueue);
            console.log('queue foreach');
            _(queues).forEach(function(queue){
                queue.room = roomName;
                queue.occupied = true;
                queue.accepted = false;
                queue.save();
            });

            fail = function(){
                console.log('fail queue foreach');
                _(queues).forEach(function(queue){
                    queue.room = '';
                    queue.occupied = false;
                    queue.accepted = false;
                    queue.save();
                });

                _(localUsers).forEach(function(localUser){
                    self.leaveGameRoom(localUser.spark, roomName).catch(console.log);
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
                    SocketAjax.sJax(sjaxDetails).catch(console.log);
                });
            };

            if(userOffline) return fail();

            _(localUsers).forEach(function(localUser){
                joinedPromises.push(self.joinGameRoom(localUser.spark, roomName));
            });

            _(remoteUsers).forEach(function(remoteUser){
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

            var qDetails = {
                game : q.game,
                users : users,
                name:qName,
                room : roomName,
                userCount : q.userCount
            };

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


    RoutQueue.prototype.checkAccepted = function(spark, q){

        GamesApi.fetch(q.game).then(function(games){
            if(!games) return false;
            QueuesApi.fetch({room: q.room, accepted : true}).then(function(queues){
                console.log('all accepted queues');
                console.log(queues);
                if(_.isArray(queues) && queues.length < games[0].userCount) return false;

                console.log('enough accepted go a head and redirect to game server');

            });
        });

    };

    RoutQueue.prototype.accept = function(spark, q){
        var self = this;
        console.log('accepting', q);
        QueuesApi.fetch({"_id" : q.id}).then(function(queues){
            var queue;
            if(!_.isArray(queues)) return false;
            console.log('fetched', queues);
            queue = queues[0];
            queue.accepted = true;
            console.log('queue before save', queue);
            queue.save(function (err, queue) {
                console.log('saved', queue);
                if(err) return console.log(err);
                q.accepted = true;
                var data = {
                    "m" : 'accept',
                    "d" : q
                };
                _s.primus.room(q.room).write({"m": "queue", "d":data});

                self.checkAccepted(spark, q)
            });
        });
    };

    RoutQueue.prototype.decline = function(spark, q){
        var self = this, queue;
        console.log('declining');
        QueuesApi.fetch(q.id).then(function(queues){
            if(!_.isArray(queues)) return false;
            var queue = queues[0];
            queue.accepted = false;
            queue.save();
            queue.save(function (err, queue) {
                if(err) return console.log(err);
                q.accepted = false;
                var data = {
                    "m" : 'decline',
                    "d" : q
                };
                _s.primus.room(q.room).write({"m": "queue", "d":data});

                self.checkAccepted(spark, q)
            });
        });
    };




    return RoutQueue;

};