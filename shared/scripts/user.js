(function(){
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = function(){ return User; };
    }else{
        if(window.ngp)
            if(window.ngp.oFns)window.ngp.oFns.User = User;
            else{
                window.ngp.oFns = {
                    User:User
                };
            }
    }

    function User(user){
        this.id = user.id || undefined;
        this.username = user.username || undefined;
    }

    User.prototype =  {
        getId: function() { return this.id; },
        getUsername: function() { return this.username; },
        setId: function(id) { this.id = id; },
        setUsername: function(username) { this.username = username; }
    };
})();