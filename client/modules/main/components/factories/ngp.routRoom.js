/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('RoutRoom', [
        'Authorization',
        'Chat',
        'Router',
        RoutRoom
    ]);

function RoutRoom(Authorization, Chat, Router) {

    function RoutRoomFactory(){
        Router.apply(this, arguments);
    }

    RoutRoomFactory.prototype = Object.create(Router.prototype);
    RoutRoomFactory.prototype.constructor = RoutRoomFactory;


    RoutRoomFactory.prototype.join = function(room){
        console.log('adding member to a channel');
        Chat.addMember(room.user, room);
    };

    RoutRoomFactory.prototype.leave = function(room){
        var user = Authorization.getUser();
        console.log('leave', room);
        if(user.id == room.user.id) Chat.leaveRoom(room);
        else Chat.removeMember(room.user, room);
    };

    RoutRoomFactory.prototype.setRooms = function(msg){
        if(!_.isArray(msg)) return false;
        _(msg).forEach(function(room){
            Chat.joinRoom(room);
        })
    };

    return RoutRoomFactory;
}