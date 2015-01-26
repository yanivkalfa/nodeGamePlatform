module.exports = function(_s, _rf){

    var router = _rf.Router
        , _ = _s.oReq.lodash
        , User = _rf.User
        ;

    function RoutRoom (){
        router.apply(this,arguments);
    }

    RoutRoom.prototype = Object.create(router.prototype);
    RoutRoom.prototype.constructor = RoutRoom;

    RoutRoom.prototype.getRooms = function(spark, msg){
        var GetRooms = new _rf.GetRooms(),
            retrieveRooms
            ;

        retrieveRooms = function(rooms){
            GetRooms.setRoomNames(rooms)
                .getSparksForAllRooms(GetRooms.roomNames.map(GetRooms.getSparksInRoom)).then(function(roomsSparks){
                    GetRooms.setRoomsSparks(roomsSparks)
                        .setSparkList()
                        .checkUserNameInPrimus()
                        .setInSpark();

                    if(GetRooms.inSparks.length) {
                        GetRooms.fetchUsersInSparks().then(function(users){
                            GetRooms.checkUserNameInDB(users)
                                .sendRooms(spark);
                        }).catch(GetRooms.sendRooms.bind(GetRooms, spark));
                    }else{
                        GetRooms.sendRooms(spark);
                    }
                }).catch(console.log);
        };

        if(msg && msg.rooms.length > 0) {
            retrieveRooms(msg.rooms);
        }else{
            GetRooms.getRoomsForSpark(spark.id).then(retrieveRooms).catch(console.log);
        }

    };

    RoutRoom.prototype.getRoom = function(spark, rname){
        var GetRooms = new _rf.GetRooms();
        GetRooms.setRoomNames([rname])
            .getSparksForAllRooms(GetRooms.roomNames.map(GetRooms.getSparksInRoom)).then(function(roomsSparks){
                GetRooms.setRoomsSparks(roomsSparks)
                    .setSparkList()
                    .checkUserNameInPrimus()
                    .setInSpark();

                if(GetRooms.inSparks.length) {
                    GetRooms.fetchUsersInSparks().then(function(users){
                        GetRooms.checkUserNameInDB(users)
                            .sendRooms(spark);
                    }).catch(GetRooms.sendRooms.bind(GetRooms, spark));
                }else{
                    GetRooms.sendRooms(spark);
                }
            }).catch(console.log);
    };

    RoutRoom.prototype.join = function(spark, room){
        var randomId = Math.floor(Math.random()*300000)
            , data
            , self = this
            , warning
            ;

        warning = function(err){
            var dateNow = Date.now();
            data  = {
                "m" : 'msg',
                "d" : {
                    "m" : 'add',
                    "d" : {
                        "id" : dateNow + randomId.toString(),
                        "toType" : "warning",
                        "to" : spark.user.username,
                        "from" : "System",
                        "date" : dateNow,
                        "msg" : err
                    }
                }
            };
            return spark.write({"m": "chat", "d":data});
        };
        if(room.id.indexOf("u_") === 0 || room.id === 'terminal') warning('Illegal room name "' + room.id + '"');

        User.fetchUser({"id":spark.user.id}).then(_rf.RoomHandler.joinRoom.bind(this,room.id)).then(function(user){
            data  = {
                "m" : 'room',
                "d" : {
                    "m" : 'join',
                    "d" : {
                        "id" : room.id,
                        "type" : room.type,
                        "user" : {username : user.username, id : user.id}
                    }
                }
            };
            _s.primus.room(room.id).write({"m": "chat", "d":data});
            spark.join(room.id, function(err, succ){
                if(err) return warning('We were unable to join you to that room');
                self.getRoom(spark, room.id);
            });

        }).catch(warning);
    };

    RoutRoom.prototype.leave = function(spark, room){
        var randomId = Math.floor(Math.random()*300000)
            , data
            , self = this
            , warning
            ;

        warning = function(err){
            var dateNow = Date.now();
            data  = {
                "m" : 'msg',
                "d" : {
                    "m" : 'add',
                    "d" : {
                        "id" : dateNow + randomId.toString(),
                        "toType" : "warning",
                        "to" : spark.user.username,
                        "from" : "System",
                        "date" : dateNow,
                        "msg" : err
                    }
                }
            };
            return spark.write({"m": "chat", "d":data});
        };
        if(room.id.indexOf("u_") === 0 || room.id === 'terminal') warning('Illegal room name "' + room.id + '"');

        User.fetchUser({"id":spark.user.id}).then(_rf.RoomHandler.leaveRoom.bind(this,room.id)).then(function(user){
            spark.leave(room.id, function(err, succ){
                if(err) return warning('We were unable to remove you from that room');


                data  = {
                    "m" : 'room',
                    "d" : {
                        "m" : 'leave',
                        "d" : {
                            "id" : room.id,
                            "type" : room.type,
                            "user" : {username : user.username, id : user.id}
                        }
                    }
                };
                _s.primus.room(room.id).write({"m": "chat", "d":data});
                spark.write({"m": "chat", "d":data});
            });

        }).catch(warning);
    };

    return RoutRoom;
};