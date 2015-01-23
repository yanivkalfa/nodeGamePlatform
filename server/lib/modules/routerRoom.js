module.exports = function(_rf){

    var router = _rf.Router;

    function RouterRoom (Primus, spark){
        router.call(this,Primus, spark);
    }

    RouterRoom.prototype = Object.create(router.prototype);
    RouterRoom.prototype.constructor = RouterRoom;


    RouterRoom.prototype.getRooms = function(){

    };

    RouterRoom.prototype.join = function(){

    };

    RouterRoom.prototype.leave = function(){

    };

    return RouterRoom;
};