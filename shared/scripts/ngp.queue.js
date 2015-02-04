/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

angular.module(ngp.const.app.name)
    .factory('Queue', [
        'UtilFunc',
        'EventEmitter',
        'QueueUser',
        'UserLists',
        Queue
    ]);

function Queue(
    UtilFunc,
    EventEmitter,
    QueueUser,
    UserLists
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
        this.users = new UserLists();
        this.maxWaitTime = queue.maxWaitTime || 3600000;
        this.userCount = queue.userCount || 2;
        this.minDetails = {};

        _(UtilFunc.toArray(queue.users)||[]).forEach(_.bind(this.users.add,this.users));

        this.init();
    }

    QueueFactory.prototype = Object.create(EventEmitter.prototype);
    QueueFactory.prototype.constructor = QueueFactory;

    QueueFactory.prototype.init = function(){
        var self = this;
        self.setMinDetails();
        this._timer = setTimeout(_.bind(self.timedOut,self), self.maxWaitTime);
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
        return self.minDetails = {"id" : self.id, "name" : self.name, "users" : self.users.get()};
    };

    QueueFactory.prototype.getMinDetails = function(){
        return  this.minDetails;
    };


    QueueFactory.prototype.usersReady = function(){
        var self = this, id, len, list;
        len = self.users.listLength();
        if(len !== self.userCount) return false;

        list = self.users.list;
        for(id in list) {
            if(!list.hasOwnProperty(id)) continue;
            if(!list[id].accepted) return false;
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