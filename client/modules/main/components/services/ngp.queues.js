/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('Queues', [
        'Lists',
        'Queue',
        Queues
    ]);

function Queues(
    Lists,
    Queue
    ) {

    function QueuesService(){
        Lists.apply(this,arguments);
    }

    QueuesService.prototype = Object.create(Lists.prototype);
    QueuesService.prototype.constructor = QueuesService;

    QueuesService.prototype.add =  function(q){
        var self = this;
        q.id = self.createRequestId();
        return self.lists[q.id] = new Queue(q);
    };

    QueuesService.prototype.remove =  function(id){
        var self = this;
        if(_.isEmpty(self.lists[id])) return false;
        self.lists[id].end('Queue removed');
        delete self.lists[id];
    };

    return new QueuesService();
}