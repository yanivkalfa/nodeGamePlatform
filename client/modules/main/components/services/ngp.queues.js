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
            , id
            ;

        q.id = self.createRequestId();
        return self.queues[q.id] = new Queue(q);
    };

    QueuesService.prototype.remove =  function(qId){
        var self = this;
        if(_.isEmpty(self.queues[qId])) return false;
        self.queues[qId].end();
        delete self.queues[qId];
    };

    QueuesService.prototype.get =  function(qId){
        var self = this;
        if(_.isEmpty(self.queues[qId])) return false;
        return self.queues[qId];
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