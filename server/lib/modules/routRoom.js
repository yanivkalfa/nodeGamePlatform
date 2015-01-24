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
        var RoomHandler = new _rf.RoomHandler(),
            getRooms
            ;

        console.log(msg);
        getRooms = function(rooms){
            RoomHandler.setRoomNames(rooms)
                .getSparksForAllRooms(RoomHandler.roomNames.map(RoomHandler.getSparksInRoom)).then(function(roomsSparks){
                    RoomHandler.setRoomsSparks(roomsSparks)
                        .setSparkList()
                        .checkUserNameInPrimus()
                        .setInSpark();

                    if(RoomHandler.inSparks.length) {
                        RoomHandler.fetchUsersInSparks().then(function(users){
                            RoomHandler.checkUserNameInDB(users)
                                .sendRooms(spark);
                        }).catch(RoomHandler.sendRooms.bind(RoomHandler, spark));
                    }else{
                        RoomHandler.sendRooms(spark);
                    }
                }).catch(console.log);
        };

        if(msg && msg.rooms.length > 0) {
            getRooms(msg.rooms);
        }else{
            RoomHandler.getRoomsForSpark(spark.id).then(getRooms).catch(console.log);
        }

    };

    RoutRoom.prototype.getRoom = function(spark, rname){
        var RoomHandler = new _rf.RoomHandler();
        RoomHandler.setRoomNames([rname])
            .getSparksForAllRooms(RoomHandler.roomNames.map(RoomHandler.getSparksInRoom)).then(function(roomsSparks){
                RoomHandler.setRoomsSparks(roomsSparks)
                    .setSparkList()
                    .checkUserNameInPrimus()
                    .setInSpark();

                if(RoomHandler.inSparks.length) {
                    RoomHandler.fetchUsersInSparks().then(function(users){
                        RoomHandler.checkUserNameInDB(users)
                            .sendRooms(spark);
                    }).catch(RoomHandler.sendRooms.bind(RoomHandler, spark));
                }else{
                    RoomHandler.sendRooms(spark);
                }
            }).catch(console.log);
    };

    RoutRoom.prototype.join = function(spark, msg){
        var dateNow = Date.now()
            , randomId = Math.floor(Math.random()*300000)
            , data
            , self = this
            ;

        /*
        User.fetchUser({id:spark.user.id}).then(function(user){
            console.log(user);
        });
        */
        if(msg.name.indexOf("u_") === 0 || msg.name === 'terminal') {
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
                        "msg" : 'Illegal room name "' + msg.name + '"'
                    }
                }
            };
            return spark.write({"m": "chat", "d":data});
        }

        spark.join(msg.name, function(){
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
    };

    RoutRoom.prototype.leave = function(spark, msg){

    };

    return RoutRoom;
};