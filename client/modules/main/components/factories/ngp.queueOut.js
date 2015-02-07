/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

(function(){
    angular.module(ngp.const.app.name)
        .factory('QueueOut', [
            'Terminal',
            'WebSocket',
            'Queues',
            QueueOut
        ]);

    function QueueOut(
        Terminal,
        WebSocket,
        Queues
        ) {

        function QueueOutFactory(){
            Terminal.apply(this, arguments);
        }

        QueueOutFactory.prototype = Object.create(Terminal.prototype);
        QueueOutFactory.prototype.constructor = QueueOutFactory;

        var prototypeExtend =  {
            join : function(q){
                return this.queue("join", q);
            },

            leave : function(q){
                return this.queue("leave", q);
            },

            queue : function(action, q){
                var data  = {
                    "m" : 'queue',
                    "d" : {
                        "m" : action,
                        "d" : q
                    }
                };
                WebSocket.Primus.write(data);
            },

            accept : function(args){
                return this.updateQueue(args, "accept");
            },

            decline : function(args){
                return this.updateQueue(args, "decline");
            },

            updateQueue : function(args, action){
                var queue = Queues.get(args[0])
                    , user = queue.users.get(args[1])
                    , room = queue.getRoom()
                    ;

                if(!queue) return {"success":false, "msg" : 'Queue was not found'};
                if(!user) return {"success":false, "msg" : 'User was not found'};
                if(!room) return {"success":false, "msg" : 'Room was not found'};

                var data  = {
                    "m" : action,
                    "d" : {"id":queue.id, "user" : user }
                };

                WebSocket.Primus.write({"m":"queue", "d": data});
                return {"success":true};
            }
        };

        _.assign(QueueOutFactory.prototype, prototypeExtend);

        return new QueueOutFactory();
    }
})();