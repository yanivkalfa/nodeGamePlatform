/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .factory('RoutQueue', [
        '$rootScope',
        '$scope',
        'Authorization',
        'Chat',
        'Router',
        RoutQueue
    ]);

function RoutQueue($rootScope,$scope,Authorization, Chat, Router) {

    function RoutQueueFactory(){
        Router.apply(this, arguments);
    }

    RoutQueueFactory.prototype = Object.create(Router.prototype);
    RoutQueueFactory.prototype.constructor = RoutQueueFactory;


    RoutQueueFactory.prototype.Ready = function(room){

        var user = Authorization.getUser();
        if(!_.isArray(room.users) && user.id == room.users.id) {
            Chat.joinRoom(Chat.createRoom(room));
        }
        else
        {
            if(!_.isArray(room.users)) {
                Chat.addMember(room.users, room);
            }
            else{
                if(Chat.indexOf(room) == -1) {
                    Chat.joinRoom(Chat.createRoom(room));
                }else{
                    _(room.users).forEach(function(user){
                        Chat.addMember(user, room);
                    })
                }

            }
        }

        $rootScope.$apply();
    };

    RoutQueueFactory.prototype.leave = function(room){
        var user = Authorization.getUser();
        if(user.id == room.users.id) Chat.leaveRoom(room);
        else Chat.removeMember(room.users, room);
        $rootScope.$apply();
    };

    return RoutQueueFactory;
}