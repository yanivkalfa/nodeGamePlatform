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

        var roomsForSpark = [], inSparks = [], sparkList = {};

        console.log('aaaa');

        _rf.RoomHandler.getRoomsForSpark(spark.id).then(function(rooms){

            if(!_.isArray(rooms)) return false;
            var promiseRooms = rooms.map(function(room, index){
                if(room.indexOf("u_") === 0 || room === 'terminal') return false;
                roomsForSpark[index] = {
                    id :room,
                    title:room,
                    content:{
                        msg : [],
                        members:[]
                    },
                    active : false
                };

                return _rf.RoomHandler.getSparksInRoom(room).then(function(index, sparks){
                        roomsForSpark[index].content.members = sparks;
                    }.bind(this,index)).catch(function(err){

                });
            });




            _s.primus.all(promiseRooms).then(function(NotImportant) {
                console.log(NotImportant);

                roomsForSpark.forEach(function(room){
                    if(!_.isArray(room.content.members)) return false;
                    for(var i=0; i < room.content.members.length; i++ ){
                        sparkList[room.content.members[i]] = false;
                    }
                });


                _s.primus.forEach(function (spark, next) {
                    _(sparkList).forEach(function(singleSpark, sparkId) {
                        if(spark.id == singleSpark){
                            sparkList[sparkId] = spark.user.username;
                            return false;
                        }
                    });
                    next();
                }, function (err) {
                    _(sparkList).forEach(function(singleSpark, sparkId) {
                        if(!singleSpark) inSparks.push(sparkId);
                    });

                    User.fetchUser({ 'spark': { $in: inSparks }}).then(function(users){
                        if(!_.isArray(users)) return false;
                        users.forEach(function(user){
                            sparkList[user.spark] = user.username;
                        });

                        roomsForSpark.forEach(function(room){
                            if(!_.isArray(room.content.members)) return false;
                            for(var i=0; i < room.content.members.length; i++ ){
                                room.content.members[i] = sparkList[room.content.members[i]];
                            }
                        });



                        console.log('aaaa');
                    }).catch(err);


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

        var data  = {
            "m" : 'roomDo',
            "d" : {
                "m" : 'getRooms',
                "d" : channels
            }
        };

        spark.write({"m": "chat", "d":data});
    };

    RoutRoom.prototype.join = function(spark, msg){

    };

    RoutRoom.prototype.leave = function(spark, msg){

    };

    return RoutRoom;
};