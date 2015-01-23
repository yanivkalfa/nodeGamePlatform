module.exports = function(_rf){

    var router = _rf.Router;

    function RoutRoom (Primus, spark){
        router.apply(this,arguments);
    }

    RoutRoom.prototype = Object.create(router.prototype);
    RoutRoom.prototype.constructor = RoutRoom;


    RoutRoom.prototype.getRooms = function(spark, msg){
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