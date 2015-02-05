/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .service('Queues', [
            //'List',
            //'Queue',
            Queues
        ]);

    function Queues(
        //List,
        //Queue
        ) {
        /*
        var List = ngp.oFns;
        var Queue = ngp.Queue;

        function QueuesService(){
            List.apply(this,arguments);
        }

        QueuesService.prototype = Object.create(List.prototype);
        QueuesService.prototype.constructor = QueuesService;

        QueuesService.prototype.add =  function(q){
            var self = this;
            var args = Array.prototype.slice.call(arguments, -1,-1);
            args.push(new Queue(q));
            return List.prototype.add.apply(self, args);
        };

        QueuesService.prototype.remove =  function(id){
            var self = this;
            if(_.isEmpty(this.list[id])) return false;
            this.list[id].end('Queue removed');
            return delete self.list[id];
        };
        */

        console.log('aaa');
        return new ngp.oFns.Queues();
    }
})();