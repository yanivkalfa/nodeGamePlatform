/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .factory('UsersList', [
            'List',
            UsersList
        ]);

    function UsersList(
        List
        ) {

        function UsersListFactory(){
            List.apply(this, arguments);
        }

        UsersListFactory.prototype = Object.create(List.prototype);
        UsersListFactory.prototype.constructor = UsersListFactory;

        UsersListFactory.prototype.getMyIndex = function(){
            var self = this
                , id
                ;

            for(id in self.list){
                if(!self.list.hasOwnProperty(id)) continue;
                if(self.list[id].isMe) return id;
            }

            return -1;
        };

        UsersListFactory.prototype.accept = function(user){
            var self = this, u;
            u = self.get(user.id);
            if(!u) return false;
            return u.accepted = true;
        };

        UsersListFactory.prototype.decline = function(user){
            var self = this, u;
            u = self.get(user.id);
            if(!u) return false;
            return u.accepted = false;
        };


        return UsersListFactory;
    }
})();