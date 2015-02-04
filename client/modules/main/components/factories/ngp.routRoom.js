/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .factory('RoutRoom', [
            '$rootScope',
            'Authorization',
            'Chat',
            'Router',
            RoutRoom
        ]);

    function RoutRoom(
        $rootScope,
        Authorization,
        Chat,
        Router
        ) {

        function RoutRoomFactory(){
            Router.apply(this, arguments);
        }

        RoutRoomFactory.prototype = Object.create(Router.prototype);
        RoutRoomFactory.prototype.constructor = RoutRoomFactory;


        RoutRoomFactory.prototype.join = function(room){

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

            /*
             var user = Authorization.getUser();
             if(!_.isArray(room.users) && user.id == room.users.id) Chat.joinRoom(Chat.createRoom(room));
             else if(!_.isArray(room.users)) Chat.addMember(room.users, room);
             else if(Chat.indexOf(room) == -1) Chat.joinRoom(Chat.createRoom(room));
             else
             {
             _(room.users).forEach(function(user){
             Chat.addMember(user, room);
             })
             }
             */

            $rootScope.$apply();
        };

        RoutRoomFactory.prototype.leave = function(room){
            var user = Authorization.getUser();
            if(user.id == room.users.id) Chat.leaveRoom(room);
            else Chat.removeMember(room.users, room);
            $rootScope.$apply();
        };

        return RoutRoomFactory;
    }
})();