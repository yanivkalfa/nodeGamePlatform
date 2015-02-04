/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

angular.module(ngp.const.app.name)
    .factory('Queue', [
        'UtilFunc',
        'EventEmitter',
        Queue
    ]);

function Queue(
    UtilFunc,
    EventEmitter
    ){

    function QueueFactory(queue){
        EventEmitter.apply(this, arguments);
        this._startTime = Date.now();
        this._endTime = undefined;
        this._timer = undefined;
        this._window = undefined;
        this._room = undefined;

        this.id = queue.id || undefined;
        this.name = queue.name || undefined;
        this.users = queue.users || [];
        this.users = UtilFunc.toArray(this.users);
        this.maxWaitTime = queue.maxWaitTime || 3600000;
        this.userCount = queue.userCount || 2;
        this.minDetails = {};
        this.init();
    }

    QueueFactory.prototype = Object.create(EventEmitter.prototype);
    QueueFactory.prototype.constructor = QueueFactory;

    QueueFactory.prototype.init = function(){
        var self = this;
        self.setMinDetails();
        this._timer = setTimeout(_.bind(self.queueTimedOut,self), self.maxWaitTime);
    };

    QueueFactory.prototype.setRoom = function(room){
        this._room = room;
    };

    QueueFactory.prototype.getRoom = function(){
        return this._room;
    };

    QueueFactory.prototype.setWindow = function(window){
        this._window = window;
    };

    QueueFactory.prototype.getWindow = function(){
        return this._window;
    };

    QueueFactory.prototype.setMinDetails = function(){
        var self = this;
        return self.minDetails = {"id" : self.id, "name" : self.name, "users" : self.users};
    };

    QueueFactory.prototype.getMinDetails = function(){
        return  this.minDetails;
    };

    QueueFactory.prototype.getMyIndex = function(){
        var self = this
            , i
            ;

        for(i=0; i < self.users.length ; i++){
            if(self.users[i].isMe) return i;
        }

        return -1;
    };

    QueueFactory.prototype.getUser = function(id){
        var self = this
            , index
            , user = self.users[id]
            ;
        if(user) return user;
        index = self.indexOf(id);
        return index == -1 ? false : self.users[index];
    };

    QueueFactory.prototype.addUser = function(user){
        var self = this
            , index
            ;
        index = self.indexOf(user.id);
        if(index !== -1)return false;
        self.users.push(user);
    };
    
    QueueFactory.prototype.removeUser = function(id){
        var self = this
            , index
            ;
        index = self.indexOf(id);
        if(index === -1) return false;
        self.users.splice(index,1);
    };

    QueueFactory.prototype.indexOf = function(id){
        var self = this, index = -1;

        _(self.users).forEach(function(user, i){
            if(id == user.id) index = i;
            return false;
        });

        return index;
    };

    QueueFactory.prototype.accept = function(user){
        var self = this, u;
        u = self.getUser(user.id);
        if(!u) return false;
        return u.accepted = true;
    };

    QueueFactory.prototype.decline = function(user){
        var self = this, u;
        u = self.getUser(user.id);
        if(!u) return false;
        return u.accepted = false;
    };

    QueueFactory.prototype.usersReady = function(){
        var self = this, i, len;
        len = self.users.length;
        if(len !== self.userCount) return false;

        for(i = 0; i < len; i++) {
            if(!self.users[i].accepted) return false;
        }
        return true;
    };


    QueueFactory.prototype.ready = function(data){
        this.trigger('ready', data);
    };

    QueueFactory.prototype.timedOut = function(data){
        var self = this;
        this.trigger('timedOut', data);
        self.endTimers();
    };

    QueueFactory.prototype.end = function(data){
        var self = this;
        this.trigger('end', data);
        self.endTimers();
    };

    QueueFactory.prototype.endTimers = function(){
        var self = this;
        self._endTime = Date.now();
        clearTimeout(self._timer);
    };

    return QueueFactory;
}