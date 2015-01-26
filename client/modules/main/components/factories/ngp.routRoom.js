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

        var user = Authorization.getUser();

        if(!_.isArray(room.users) && user.id == room.users.id) {
            Chat.joinRoom(room);
        }
        else
        {
            if(!_.isArray(room.users)) Chat.addMember(room.users, room);
            else{
                _(room.users).forEach(function(user){
                    Chat.addMember(user, room);
                })
            }
        }

    };

    RoutRoomFactory.prototype.leave = function(room){
        var user = Authorization.getUser();
        console.log('leave', room);
        if(user.id == room.users.id) Chat.leaveRoom(room);
        else Chat.removeMember(room.users, room);
    };

    RoutRoomFactory.prototype.setRooms = function(msg){
        if(!_.isArray(msg)) return false;
        _(msg).forEach(function(room){
            Chat.joinRoom(room);
        })
    };

    return RoutRoomFactory;
}