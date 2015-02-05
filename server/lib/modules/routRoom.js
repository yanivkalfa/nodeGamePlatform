module.exports = function(_s, _rf){

    console.log('got to routROom');
    /*
    var router = _rf.Router
        , _ = _s.oReq.lodash
        , User = _rf.User
        , RoutMsg = new _rf.RoutMsg()
        ;
    */

    var pathsList = _s.oConfig.pathsList
        , router = require(pathsList.Router)
        , User = require(pathsList.User)(_s)
        , RoutMsg = new require(pathsList.RoutMsg)(_s)
        , GetRoom = require(pathsList.GetRoom)(_s)
        , RoomHandler = require(pathsList.RoomHandler)(_s)
        ;

    
    function RoutRoom (){
        router.apply(this,arguments);
    }

    RoutRoom.prototype = Object.create(router.prototype);
    RoutRoom.prototype.constructor = RoutRoom;


    RoutRoom.prototype.getRoom = function(spark, room){
        var GetRoom = new GetRoom();
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
        if(room.id.indexOf("u_") === 0 || room.id === 'terminal') {
            RoutMsg.warningMsg(spark, warningMsg);
            return false;
        }
        return true;
    };


    RoutRoom.prototype.join = function(spark, room, noStore){
        var data
            , self = this
            , joinRoom
            ;

        if(!self._checkChannel(spark, room, 'Illegal room name "' + room.id + '"')) return false;

        joinRoom = function(user){
            spark.join(room.id, function(err, succ){
                if(err) return RoutMsg.warningMsg(spark, 'We were unable to join you to that room');
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
            User.fetchUser({"id":spark.user.id}).then(joinRoom).catch(RoutMsg.warningMsg.bind(spark));
        }else{
            User.fetchUser({"id":spark.user.id}).then(RoomHandler.joinRoom.bind(this,room.id)).then(joinRoom).catch(RoutMsg.warningMsg.bind(spark));
        }

    };

    RoutRoom.prototype.leave = function(spark, room, noStore){
        var data
            , self = this
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
                if(err) return RoutMsg.warningMsg(spark, 'We were unable to remove you from that room');
            });
        };

        if(noStore){
            User.fetchUser({"id":spark.user.id}).then(leaveRoom).catch(RoutMsg.warningMsg.bind(spark));
        }else{
            User.fetchUser({"id":spark.user.id}).then(RoomHandler.leaveRoom.bind(this,room.id)).then(leaveRoom).catch(RoutMsg.warningMsg.bind(spark));
        }
    };

    return RoutRoom;
};
