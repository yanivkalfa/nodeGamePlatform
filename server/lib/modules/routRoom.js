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
        var starTime = Date.now();

        var roomsForSpark = []
            , inSparks = []
            , sparkList = {}
            , unique = {}
            , finishSparks;

        _rf.RoomHandler.getRoomsForSpark(spark.id).then(function(rooms){

            if(!_.isArray(rooms)) return false;
            var filter = function(room){ return !(room.indexOf("u_") === 0 || room === 'terminal'); };
            var promiseRooms = rooms.filter(filter).map(_rf.RoomHandler.getSparksInRoom);


            _s.oReq.Promise.all(promiseRooms).then(function(NotImportant) {
                roomsForSpark = NotImportant;

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

                    finishSparks = function(){
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

                        var endTime = Date.now();

                        console.log(endTime-starTime /1000 );
                    };

                    if(inSparks.length) {
                        User.fetchUsers({ 'spark': { $in: inSparks }}).then(function(users){
                            if(!_.isArray(users)) return false;
                            users.forEach(function(user){
                                sparkList[user.spark] = {username : user.username, id : user.id};
                            });

                            finishSparks();
                        }).catch(err);
                    }else{
                        finishSparks();
                    }
                });
            });

        }).catch(function(err){

        });


        var channels = [
            {
                id : '',
                title:'Dynamic Title 1',
                content:{
                    msg : [
                        {id:"01",from:"SomeOne", data: 1421700566413, formatDate :  '', content : "This is a message", toType: "private"},
                        {id:"02",from:"SomeOne", data: 1421700569382, formatDate :  '', content : "message 2" , toType: "room"},
                        {id:"03",from:"SomeOne", data: 1421700502938, formatDate :  '', content : "message 3" , toType: "room"}
                    ],
                    members:['SomeOne', 'someone2', 'someone3']
                },
                active : true
            },
            {
                id : '',
                title:'Dynamic Title 2',
                content:{
                    msg : [
                        {id:"01",from:"SomeOne", data: 1421700566413, formatDate : '', content : "This is a message", toType: "room"},
                        {id:"02",from:"SomeOne", data: 1421700569382, formatDate : '', content : "message 2" , toType: "room"},
                        {id:"03",from:"SomeOne", data: 1421700502938, formatDate : '', content : "message 3" , toType: "room"}
                    ],
                    members:['SomeOne', 'someone2', 'someone3']
                },
                active : false
            }
        ];
    };

    RoutRoom.prototype.join = function(spark, msg){

    };

    RoutRoom.prototype.leave = function(spark, msg){

    };

    return RoutRoom;
};