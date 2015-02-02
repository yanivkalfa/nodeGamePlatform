/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .factory('QueueOut', [
        'Terminal',
        'WebSocket',
        //'Authorization',
        'Queues',
        QueueOut
    ]);

function QueueOut(
    Terminal,
    WebSocket,
    //Authorization,
    Queues
    ) {

    function QueueOutFactory(){
        Terminal.apply(this, arguments);
    }

    QueueOutFactory.prototype = Object.create(Terminal.prototype);
    QueueOutFactory.prototype.constructor = QueueOutFactory;

    var prototypeExtend =  {
        join : function(args){
            return this.queue(args, "join");
        },

        leave : function(args){
            return this.queue(args, "leave");
        },

        queue : function(args, action){
            var queue = Queues.get(args[0]);
            if(!queue) return {success:false, "msg" : 'Queue was not found'};
            var data  = {
                "m" : 'queue',
                "d" : {
                    "m" : action,
                    "d" : queue.getMinDetails()
                }
            };
            WebSocket.Primus.write(data);
            return {success:true};
        }
    };

    _.assign(QueueOutFactory.prototype, prototypeExtend);

    return new QueueOutFactory();
}