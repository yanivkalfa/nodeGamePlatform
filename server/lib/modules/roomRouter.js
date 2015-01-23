module.exports = function(_rf){

    var router = _rf.router;

    function RoomRouter (Primus, spark){
        router.call(this,Primus, spark);
    }

    RoomRouter.prototype = Object.create(router.prototype);
    RoomRouter.prototype.constructor = RoomRouter;


    RoomRouter.prototype.getRooms = function(){

    };

    RoomRouter.prototype.join = function(){

    };

    RoomRouter.prototype.leave = function(){

    };

    return RoomRouter;
};