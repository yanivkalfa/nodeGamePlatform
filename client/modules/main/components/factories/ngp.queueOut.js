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

            queue : function(method, q){
                var data  = {
                    "m" : 'queue',
                    "d" : {
                        "m" : method,
                        "d" : q
                    }
                };
                WebSocket.Primus.write(data);
            },

            accept : function(q, u){
                return this.updateQueue("accept", q, u);
            },

            decline : function(q, u){
                return this.updateQueue("decline", q, u);
            },

            updateQueue : function(method, q, u){
                var room = q.getRoom()
                    , game = q.game
                    ;

                if(!q) return {"success":false, "msg" : 'Queue was not found'};
                if(!u) return {"success":false, "msg" : 'User was not found'};
                if(!room) return {"success":false, "msg" : 'Room was not found'};
                if(!game) return {"success":false, "msg" : 'Game was not found'};

                var data  = {
                    "m" : method,
                    "d" : {"id":q.id, "room" : room, "user" : { id : u.id, username : u.username }, game :  game}
                };

                WebSocket.Primus.write({"m":"queue", "d": data});
                return {"success":true};
            }
        };

        _.assign(QueueOutFactory.prototype, prototypeExtend);

        return new QueueOutFactory();
    }
})();