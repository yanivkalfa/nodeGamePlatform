/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .factory('Queue', [
            'EventEmitter',
            'UsersList',
            Queue
        ]);

    function Queue(
        EventEmitter,
        UsersList
        ){

        function QueueFactory(queue){
            EventEmitter.apply(this, arguments);
            this._startTime = Date.now();
            this._endTime = undefined;
            this._interval = undefined;
            this.timer = '';
            this._window = undefined;
            this._room = undefined;

            this.users = new UsersList();

            this.id = queue.id || undefined;
            this.name = queue.name || undefined;
            this.game = queue.game || undefined;
            //this.maxWaitTime = queue.maxWaitTime || 3600000;
            this.userCount = queue.userCount || 2;
            this.minDetails = {};

            this.init();
        }

        QueueFactory.prototype = Object.create(EventEmitter.prototype);
        QueueFactory.prototype.constructor = QueueFactory;

        QueueFactory.prototype.init = function(){
            var self = this;
            self.setMinDetails();
        };

        QueueFactory.prototype.startTimer = function(seconds, perSecFn, endFn){
            var self = this;
            if(seconds <=0) return false;
            self.timer = seconds;
            if('function' === typeof perSecFn) perSecFn();
            self._interval = setInterval(function(){
                self.timer--;
                if('function' === typeof perSecFn) perSecFn();
                if(self.timer <= 0){
                    self.clearTimers();
                    if('function' === typeof endFn) endFn();
                }
            }, 1000);
        };

        QueueFactory.prototype.clearTimers = function(endFn){
            clearInterval(this._interval);
            this.timer = '';
            if('function' === typeof endFn) endFn();
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
            return self.minDetails = {"id" : self.id, "name" : self.name, "user" : self.users.get()};
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
})();