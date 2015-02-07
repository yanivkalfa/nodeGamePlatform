(function(){

    var UtilFunc
        , EventEmitter
        , UsersList
        ;

    if (typeof module !== 'undefined' && module.exports) {
        UtilFunc = require('./utilFunc.js');
        EventEmitter = require('./eventEmitter.js');
        UsersList = require('./usersList.js');
    }else{
        UtilFunc = window.ngp.oFns.UtilFunc;
        EventEmitter = window.ngp.oFns.EventEmitter;
        UsersList = window.ngp.oFns.UsersList;
    }

    function Queue(queue){
        EventEmitter.apply(this, arguments);
        this._startTime = Date.now();
        this._endTime = undefined;
        this._timer = undefined;
        this._window = undefined;
        this._room = undefined;

        this.users = new UsersList();

        this.id = queue.id || undefined;
        this.name = queue.name || undefined;
        this.game = queue.game || undefined;
        this.maxWaitTime = queue.maxWaitTime || 3600000;
        this.userCount = queue.userCount || 2;
        this.minDetails = {};

        this.init();
    }

    Queue.prototype = Object.create(EventEmitter.prototype);
    Queue.prototype.constructor = Queue;

    Queue.prototype.init = function(){
        var self = this;
        self.setMinDetails();
        this._timer = setTimeout(_.bind(self.timedOut,self), self.maxWaitTime);
    };

    Queue.prototype.setRoom = function(room){
        this._room = room;
    };

    Queue.prototype.getRoom = function(){
        return this._room;
    };

    Queue.prototype.setWindow = function(window){
        this._window = window;
    };

    Queue.prototype.getWindow = function(){
        return this._window;
    };

    Queue.prototype.setMinDetails = function(){
        var self = this;
        return self.minDetails = {"id" : self.id, "name" : self.name, "user" : self.users.get()};
    };

    Queue.prototype.getMinDetails = function(){
        return  this.minDetails;
    };


    Queue.prototype.usersReady = function(){
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


    Queue.prototype.ready = function(data){
        this.trigger('ready', data);
    };

    Queue.prototype.timedOut = function(data){
        var self = this;
        this.trigger('timedOut', data);
        self.endTimers();
    };

    Queue.prototype.end = function(data){
        var self = this;
        this.trigger('end', data);
        self.endTimers();
    };

    Queue.prototype.endTimers = function(){
        var self = this;
        self._endTime = Date.now();
        clearTimeout(self._timer);
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Queue;
    }else{
        if(window.ngp)
            if(window.ngp.oFns)window.ngp.oFns.Queue = Queue;
            else{
                window.ngp.oFns = {
                    Queue:Queue
                };
            }
    }
})();