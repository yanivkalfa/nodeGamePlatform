module.exports = function(_rf){

    var router = _rf.Router;

    function RoutRoom (Primus, spark){
        router.apply(this,arguments);
    }

    RoutRoom.prototype = Object.create(router.prototype);
    RoutRoom.prototype.constructor = RoutRoom;


    RoutRoom.prototype.getRooms = function(spark, msg){

    };

    RoutRoom.prototype.join = function(spark, msg){

    };

    RoutRoom.prototype.leave = function(spark, msg){

    };

    return RoutRoom;
};