/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .factory('BasicUser', [
            'User',
            BasicUser
        ]);

    function BasicUser(User) {

        function BasicUserFactory(user){
            User.apply(this,arguments);
            this.email = user.email || undefined;
            this.roles = user.roles || [];
        }

        BasicUserFactory.prototype = Object.create(User.prototype);
        BasicUserFactory.prototype.constructor = BasicUserFactory;

        BasicUserFactory.prototype =  {
            getId: function() { return this.id; },
            getUsername: function() { return this.username; },
            getEmail: function() { return this.email; },
            getRoles: function() { return this.roles; },

            setId: function(id) { this.id = id; },
            setUsername: function(username) { this.username = username; },
            setEmail: function(email) { this.email = email; },
            setRoles: function(roles) { this.roles = roles; }
        };

        return BasicUserFactory;
    }
})();