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
        var RoomHandler = new _rf.RoomHandler()
            , sendRooms;

        RoomHandler.getRoomsForSpark(spark.id).then(function(rooms){
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
        }).catch(console.log)
    };

    /*
    RoutRoom.prototype.getRooms = function(spark, msg){

        // @todo improve error catching as there is none currently and maybe cut down on the loops.
        var roomsForSpark = []
            , inSparks = []
            , sparkList = {}
            , unique = {}
            , finishGetRooms;

        _rf.RoomHandler.getRoomsForSpark(spark.id).then(function(rooms){

            if(!_.isArray(rooms)) return false;
            var filter = function(room){ return !(room.indexOf("u_") === 0 || room === 'terminal'); };
            var promiseRooms = rooms.filter(filter).map(_rf.RoomHandler.getSparksInRoom);


            _s.oReq.Promise.all(promiseRooms).then(function(sparks) {
                roomsForSpark = rooms.filter(filter).map(function(room, index){
                    return {
                        id :room,
                        title:room,
                        content:{
                            msg : [],
                            members:sparks[index]
                        },
                        active : false
                    };
                });


                roomsForSpark.forEach(function(room){
                    if(!_.isArray(room.content.members)) return false;
                    for(var i=0; i < room.content.members.length; i++ ){
                        sparkList[room.content.members[i]] = false;
                    }
                });


                _s.primus.forEach(function (spark, next) {
                    _(sparkList).forEach(function(singleSpark, sparkId) {
                        if(spark.id == sparkId){
                            sparkList[sparkId] = {username : spark.user.username, id : spark.user.id};
                            return false;
                        }
                    });
                    next();
                }, function (err) {
                    _(sparkList).forEach(function(singleSpark, sparkId) {
                        if(!singleSpark) inSparks.push(sparkId);
                    });

                    finishGetRooms = function(){
                        _(sparkList).forEach(function(singleSpark, sparkId) {
                            if(!singleSpark) delete sparkList[sparkId];
                            if(! unique[singleSpark.id] ) unique[singleSpark.id] = {count:0, sparkId : sparkId};
                            unique[singleSpark.id].count++;
                        });

                        _(unique).forEach(function(item, index) {
                            if(item.count > 1) delete sparkList[item.sparkId];
                        });

                        unique =  null;

                        roomsForSpark.forEach(function(room){
                            if(!_.isArray(room.content.members)) return false;
                            for(var i=0; i < room.content.members.length; i++ ){
                                room.content.members[i] = sparkList[room.content.members[i]];
                            }
                        });


                        var data  = {
                            "m" : 'roomDo',
                            "d" : {
                                "m" : 'getRooms',
                                "d" : roomsForSpark
                            }
                        };

                        spark.write({"m": "chat", "d":data});
                    };

                    if(inSparks.length) {
                        User.fetchUsers({ 'spark': { $in: inSparks }}).then(function(users){
                            if(!_.isArray(users)) return false;
                            users.forEach(function(user){
                                sparkList[user.spark] = {username : user.username, id : user.id};
                            });

                            finishGetRooms();
                        }).catch(function(err){
                            finishGetRooms();
                        });
                    }else{
                        finishGetRooms();
                    }
                });
            });

        }).catch(function(err){

        });

    };
    */

    RoutRoom.prototype.getRoom = function(spark, msg){

    };

    RoutRoom.prototype.join = function(spark, msg){

    };

    RoutRoom.prototype.leave = function(spark, msg){

    };

    return RoutRoom;
};