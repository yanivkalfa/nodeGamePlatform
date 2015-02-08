/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .factory('QueueUser', [
            'User',
            QueueUser
        ]);

    function QueueUser(
        User
        ){

        function QueueUserFactory(user){
            User.apply(this,arguments);
            this.accepted = user.accepted || undefined;
            this.isMe = user.isMe || false;
        }

        QueueUserFactory.prototype = Object.create(User.prototype);
        QueueUserFactory.prototype.constructor = QueueUserFactory;

        QueueUserFactory.prototype =  {
            getId: function() { return this.id; },
            getUsername: function() { return this.username; },
            isAccepted: function() { return this.accepted; },
            isMe: function() { return this.isMe; },

            setId: function(id) { this.id = id; },
            setUsername: function(username) { this.username = username; },
            setIsMe: function(isMe) { this.isMe = isMe; },
            setAccepted: function(accepted) { this.accepted = accepted; }
        };

        return QueueUserFactory;
    }
})();