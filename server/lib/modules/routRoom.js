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

    RoutRoom.prototype.join = function(spark, msg){
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
        if(msg.name.indexOf("u_") === 0 || msg.name === 'terminal') warning('Illegal room name "' + msg.name + '"');

        User.fetchUser({"id":spark.user.id}).then(_rf.RoomHandler.joinRoom.bind(this,msg.name)).then(function(user){
            spark.join(msg.name, function(err, succ){
                if(err) warning('We were unable to join you to that room');
                self.getRoom(spark, msg.name);

                data  = {
                    "m" : 'roomDo',
                    "d" : {
                        "m" : 'join',
                        "d" : {
                            "name" : msg.name,
                            "type" : msg.type,
                            "username" : spark.user.username
                        }
                    }
                };
                _s.primus.room(msg.name).except(spark.id).write({"m": "chat", "d":data});
            });

        }).catch(warning);
    };

    RoutRoom.prototype.leave = function(spark, msg){

    };

    return RoutRoom;
};