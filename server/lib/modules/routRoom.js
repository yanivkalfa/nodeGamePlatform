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



    RoutRoom.prototype.getRoom = function(spark, room){
        var GetRoom = new _rf.GetRoom();
        return new _s.oReq.Promise(function(resolve, reject) {
            GetRoom.getSparksInRoom(room)
                .then(function(roomSparks){
                    GetRoom.setRoomSparks(roomSparks)
                        .setSparkList()
                        .checkUserNameInPrimus()
                        .setInSpark()
                        .fetchUsersInSparks().then(function(users){
                            GetRoom.checkUserNameInDB(users)
                                .cleanSparkList()
                                .assembleRoom();
                            resolve(GetRoom);
                        }).catch(reject);
                }).catch(reject)
        });
    };

    RoutRoom.prototype._join = function(spark, room){
        this.join(spark, room, true);
    };

    RoutRoom.prototype._leave = function(spark, room){
        this.leave(spark, room, true);
    };

    RoutRoom.prototype._checkChannel = function(spark, room, warningMsg){
        var randomId = Math.floor(Math.random()*300000)
            , data
            ;

        if(room.id.indexOf("u_") === 0 || room.id === 'terminal') {
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
                        "msg" : warningMsg
                    }
                }
            };
            spark.write({"m": "chat", "d":data});
            return false;
        }
        return true;
    };


    RoutRoom.prototype.join = function(spark, room, noStore){
        var randomId = Math.floor(Math.random()*300000)
            , data
            , self = this
            , warning
            , joinRoom
            ;

        if(!self._checkChannel(spark, room, 'Illegal room name "' + room.id + '"')) return false;

        joinRoom = function(user){
            spark.join(room.id, function(err, succ){
                if(err) return warning('We were unable to join you to that room');
                data  = {
                    "m" : 'room',
                    "d" : {
                        "m" : 'join',
                        "d" : {
                            "id" : room.id,
                            "type" : room.type,
                            "users" : {username : user.username, id : user.id}
                        }
                    }
                };
                _s.primus.room(room.id).write({"m": "chat", "d":data});
                self.getRoom(spark, room.id).then(function(GetRoom){
                    data.d.d.users = GetRoom.getRoomUsers();
                    spark.write({"m": "chat", "d":data});
                });
            });

        };

        if(noStore){
            User.fetchUser({"id":spark.user.id}).then(joinRoom).catch(warning);
        }else{
            User.fetchUser({"id":spark.user.id}).then(_rf.RoomHandler.joinRoom.bind(this,room.id)).then(joinRoom).catch(warning);
        }

    };

    RoutRoom.prototype.leave = function(spark, room, noStore){
        var randomId = Math.floor(Math.random()*300000)
            , data
            , self = this
            , warning
            , leaveRoom
            ;

        if(!self._checkChannel(spark, room, 'Illegal room name "' + room.id + '"')) return false;

        leaveRoom = function(user){
            data  = {
                "m" : 'room',
                "d" : {
                    "m" : 'leave',
                    "d" : {
                        "id" : room.id,
                        "type" : room.type,
                        "users" : {username : user.username, id : user.id}
                    }
                }
            };
            _s.primus.room(room.id).write({"m": "chat", "d":data});
            spark.leave(room.id, function(err, succ){
                if(err) return warning('We were unable to remove you from that room');
            });
        };

        if(noStore){
            User.fetchUser({"id":spark.user.id}).then(leaveRoom).catch(warning);
        }else{
            User.fetchUser({"id":spark.user.id}).then(_rf.RoomHandler.leaveRoom.bind(this,room.id)).then(leaveRoom).catch(warning);
        }
    };

    return RoutRoom;
};

/*
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
 };*/