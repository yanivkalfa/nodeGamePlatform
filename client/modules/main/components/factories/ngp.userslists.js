/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .factory('UserLists', [
            'Lists',
            UserLists
        ]);

    function UserLists(
        Lists
        ) {

        function UserListsFactory(){
            Lists.apply(this, arguments);
        }

        UserListsFactory.prototype = Object.create(Lists.prototype);
        UserListsFactory.prototype.constructor = UserListsFactory;

        UserListsFactory.prototype.getMyIndex = function(){
            var self = this
                , id
                ;

            for(id in self.list){
                if(!self.list.hasOwnProperty(id)) continue;
                if(self.list[id].isMe) return id;
            }

            return -1;
        };

        UserListsFactory.prototype.accept = function(user){
            var self = this, u;
            u = self.get(user.id);
            if(!u) return false;
            return u.accepted = true;
        };

        UserListsFactory.prototype.decline = function(user){
            var self = this, u;
            u = self.get(user.id);
            if(!u) return false;
            return u.accepted = false;
        };


        return UserListsFactory;
    }
})();