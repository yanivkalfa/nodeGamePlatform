(function(){
    var User;
    if (typeof module !== 'undefined' && module.exports) {
        User = require('./user.js');

        module.exports = function(){ return BasicUser;};
    }else{
        if(window.ngp)
            if(window.ngp.oFns)window.ngp.oFns.BasicUser = BasicUser;
            else{
                window.ngp.oFns = {
                    BasicUser:BasicUser
                };
            }
        User = window.ngp.oFns.User;
    }

    function BasicUser(user){
        User.apply(this,arguments);
        this.email = user.email || undefined;
        this.roles = user.roles || [];
    }

    BasicUser.prototype = Object.create(User.prototype);
    BasicUser.prototype.constructor = BasicUser;

    BasicUser.prototype =  {
        getId: function() { return this.id; },
        getUsername: function() { return this.username; },
        getEmail: function() { return this.email; },
        getRoles: function() { return this.roles; },

        setId: function(id) { this.id = id; },
        setUsername: function(username) { this.username = username; },
        setEmail: function(email) { this.email = email; },
        setRoles: function(roles) { this.roles = roles; }
    };

})();