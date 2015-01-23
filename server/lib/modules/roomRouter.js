module.exports = function(_s, _rf){

    var router = _rf.router
        , _ = _s.oReq.lodash
        ;

    function RoomRouter (_s, Primus, spark){
        router.call(this,_s, Primus, spark);
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