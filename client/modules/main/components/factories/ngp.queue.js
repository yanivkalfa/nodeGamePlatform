/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

angular.module(ngp.const.app.name)
    .factory('Queue', [
        'UtilFunc',
        Queue
    ]);

function Queue(
    UtilFunc
    ){

    function QueueFactory(queue){
        this._startTime = Date.now();
        this._endTime = undefined;
        this._timer = undefined;

        this.id = queue.id || undefined;
        this.name = queue.name || undefined;
        this.users = queue.users || [];
        this.users = UtilFunc.toArray(this.users);
        this.maxWaitTime = queue.maxWaitTime || 3600000;
        this.maxUserCount = queue.maxUserCount || 2;
        this.minDetails = {};

        this.end = queue.end || [];
        this.end = UtilFunc.toArray(this.end);

        this.ready = queue.ready || [];
        this.ready = UtilFunc.toArray(this.ready);

        this.timedOut = queue.timedOut || [];
        this.timedOut = UtilFunc.toArray(this.timedOut);
        this.init();
    }

    QueueFactory.prototype.init = function(){
        var self = this;
        self.setMinDetails();
        this._timer = setTimeout(_.bind(self.queueTimedOut,self), self.maxWaitTime);
    };

    QueueFactory.prototype.setMinDetails = function(){
        var self = this;
        return self.minDetails = {"id" : self.id, "name" : self.name, "users" : self.users};
    };

    QueueFactory.prototype.getMinDetails = function(){
        return  this.minDetails;
    };

    QueueFactory.prototype.getUser = function(id){
        var self = this
            , index
            ;
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


    QueueFactory.prototype.queueReady = function(data){
        this.ready.forEach(function(fn){ fn(data);});
    };

    QueueFactory.prototype.queueTimedOut = function(data){
        var self = this;
        self.timedOut.forEach(function(fn){ fn(data);});
        self.endTimers();
    };

    QueueFactory.prototype.endQueue = function(data){
        var self = this;
        self.end.forEach(function(fn){ fn(data);});
        self.endTimers();
    };

    QueueFactory.prototype.endTimers = function(){
        var self = this;
        self._endTime = Date.now();
        clearTimeout(self._timer);
    };

    return QueueFactory;
}