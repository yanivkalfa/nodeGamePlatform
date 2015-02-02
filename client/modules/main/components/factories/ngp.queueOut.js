/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .factory('QueueOut', [
        'Terminal',
        'WebSocket',
        'Authorization',
        QueueOut
    ]);

function QueueOut(Terminal,WebSocket, Authorization) {

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
            var user = Authorization.getUser();
            var data  = {
                "m" : 'queue',
                "d" : {
                    "m" : action,
                    "d" : {
                        "queue" : args[0],
                        "users" : {username : user.username, id : user.id}
                    }
                }
            };
            WebSocket.Primus.write(data);
            return true;
        }
    };

    _.assign(QueueOutFactory.prototype, prototypeExtend);

    return new QueueOutFactory();
}