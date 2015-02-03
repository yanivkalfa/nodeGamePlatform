/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('Queues', [
        'Queue',
        Queues
    ]);

function Queues(
    Queue
    ) {

    function QueuesService(){
        this.queues = {};
    }

    QueuesService.prototype.add =  function(q){
        var self = this
            ;

        q.id = self.createRequestId();
        return self.queues[q.id] = new Queue(q);
    };

    QueuesService.prototype.remove =  function(id){
        var self = this;
        if(_.isEmpty(self.queues[id])) return false;
        self.queues[id].endQueue('Queue removed');
        delete self.queues[id];
    };

    QueuesService.prototype.get =  function(id){
        var self = this;
        if(_.isEmpty(self.queues[id])) return false;
        return self.queues[id];
    };

    QueuesService.prototype.getByRoomName =  function(rName){
        var self = this, queue;
        for(var id in self.queues){
            if(!self.queues.hasOwnProperty(id)) continue;
            if(rName == self.queues[id]._room) queue = self.queues[id];
            break;
        }

        return queue;
    };

    QueuesService.prototype.createRequestId = function(){
        var genRandomId = function(){
                var start = Math.floor(Math.random()*30000).toString()
                    , dateNow = Date.now().toString()
                    ;
                return start+dateNow
            }
            , self = this
            , id = genRandomId()
            ;

        while(!_.isEmpty(self.queues[id])){
            id = genRandomId();
        }
        return id;
    };

    return new QueuesService();
}