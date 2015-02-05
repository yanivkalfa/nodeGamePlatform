(function(){
    var User;
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = QueueUser;
        User = require('./user.js');
    }else{
        if(window.ngp)
            if(window.ngp.oFns)window.ngp.oFns.QueueUser = QueueUser;
            else{
                window.ngp.oFns = {
                    QueueUser:QueueUser
                };
            }
        User = window.ngp.oFns.User;
    }

    function QueueUser(user){
        User.apply(this,arguments);
        this.accepted = user.accepted || false;
        this.isMe = user.isMe || false;
    }

    QueueUser.prototype = Object.create(User.prototype);
    QueueUser.prototype.constructor = QueueUser;

    QueueUser.prototype =  {
        getId: function() { return this.id; },
        getUsername: function() { return this.username; },
        isAccepted: function() { return this.accepted; },
        isMe: function() { return this.isMe; },

        setId: function(id) { this.id = id; },
        setUsername: function(username) { this.username = username; },
        setIsMe: function(isMe) { this.isMe = isMe; },
        setAccepted: function(accepted) { this.accepted = accepted; }
    };
})();