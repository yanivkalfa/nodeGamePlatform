module.exports = function(_s){

    var pathsList = _s.oConfig.pathsList
        , router = require(pathsList.Router)
        , GamesApi = require(pathsList.GamesApi)(_s)
        , QueuesApi = require(pathsList.QueuesApi)(_s)
        , QueueOut = require(pathsList.QueueOut)(_s)
        , Servers = require(_s.oConfig.pathsList.Servers)(_s)
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
        console.log('leaveing : ', room);
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
        // getting all un occupied queues that fit a certain name sorting by data and limiting to game amount.
        QueuesApi.fetchSortLimit({"name" : qName, occupied : false}, 'start', q.userCount).then(function(queues){
            console.log('qeueueueueue:', queues);
            if(_.isArray(queues) && queues.length < q.userCount) return false;

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

            // iterating over queues  to set up user / queue
            _(queues).forEach(handleQueue);

            // iterating over queues  set room name / if room occupied or accepted.
            _(queues).forEach(function(queue){
                queue.room = roomName;
                queue.occupied = true;
                queue.accepted = false;
                queue.save();
            });


            // if a user is offline or for some reason is un reachable we reset their
            // queue, and let everyone else know they need to leave game room
            fail = function(){
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
                    // if server is offline or un reachable - we will get connect ECONNREFUSED - not an error
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
                    "accepted" : false,
                    "occupied" : false,
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
        QueuesApi.remove({"_id" : q.id}).then(function(success){
            console.log(success);
            if(success) queueOut.leave(spark, q);
        });
    };


    RoutQueue.prototype.checkAccepted = function(spark, q){
        var self = this, fail;

        GamesApi.fetch(q.game).then(function(games){
            if(!games) return false;
            QueuesApi.fetch({room: q.room}).then(function(queues){
                if(!_.isArray(queues)) return false;
                var neededCount
                    , acceptedUsers
                    , users = {}
                    , details
                    , gameName
                    , serverDetails
                    , queueLeave
                    ;

                fail = function(){
                    _(queues).forEach(function(queue){
                        queue.room = '';
                        queue.occupied = false;
                        queue.accepted = false;
                        queue.save();
                    });
                };

                if(!q.accepted) return fail();

                neededCount = games[0].userCount;
                gameName = games[0].name;
                acceptedUsers = 0;

                _(queues).forEach(function(queue){
                    if(queue.accepted) acceptedUsers++;
                    users[queue.user.id] = true;
                });

                if(acceptedUsers != neededCount ) return false;

                details = {
                    userDetails : {},
                    gameDetails : {
                        name : gameName,
                        type : gameName,
                        room : q.room,
                        expectingPlayers : users
                    }
                };

                serverDetails = {
                    "address" : "54.165.132.121",
                    "pot" : 8001
                };

                queueLeave = function(warrning){
                    queueOut.queueEnd(spark, {"name" : q.game, room: q.room}, warrning);
                    _(queues).forEach(function(queue){
                        queue.remove();
                    });
                };

                Servers.startGame(serverDetails, details).then(function(gameDetails){
                    queueLeave();
                    gameDetails.serverDetails = serverDetails;
                    queueOut.gameReady(spark, gameDetails);
                }).catch(queueLeave.bind('There was a problem creating the game'));
            });
        });

    };

    RoutQueue.prototype.accept = function(spark, q){
        var self = this, queue;
        QueuesApi.fetch({"_id" : q.id}).then(function(queues){
            if(!_.isArray(queues)) return false;
            queue = queues[0];
            queue.accepted = true;
            queue.save(function (err, queue) {
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
        QueuesApi.fetch({"_id" : q.id}).then(function(queues){
            if(!_.isArray(queues)) return false;
            var queue = queues[0];
            queue.start = new Date();
            queue.occupied = false;
            queue.accepted = false;
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