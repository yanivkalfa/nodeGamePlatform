/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('RoutRoom', [
        '$rootScope',
        'UtilFunc',
        'Chat',
        'Router',
        RoutRoom
    ]);

function RoutRoom($rootScope, UtilFunc, Chat, Router) {

    function RoutRoomFactory(){
        Router.apply(this, arguments);
    }

    RoutRoomFactory.prototype = Object.create(Router.prototype);
    RoutRoomFactory.prototype.constructor = RoutRoomFactory;


    RoutRoomFactory.prototype.join = function(msg){
        Chat.addMember(msg.user, msg.room);
    };

    RoutRoomFactory.prototype.leave = function(msg){

    };

    RoutRoomFactory.prototype.setRooms = function(msg){
        if(!_.isArray(msg)) return false;
        _(msg).forEach(function(room){
            Chat.joinRoom(room);
        })
    };

    return RoutRoomFactory;
}