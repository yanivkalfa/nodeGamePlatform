/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

angular.module(ngp.const.app.name)
    .factory('Queue', [
        Queue
    ]);

function Queue() {

    function QueueFactory(queue){
        this.id = queue.id || undefined;
        this.name = queue.name || undefined;
        this.users = [];
        this.startDate = Date.now();

        this.end = queue.end || this.noop;
        this.ready = queue.ready || this.noop;
    }
    QueueFactory.prototype.noop = function(){};
    QueueFactory.prototype.addUser = function(){};
    QueueFactory.prototype.removeUser = function(){};

    return QueueFactory;
}