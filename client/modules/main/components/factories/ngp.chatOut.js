/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('ChatOut', [
        'WebSocket',
        'Authorization',
        ChatOut
    ]);

function ChatOut(WebSocket, Authorization) {

    function ChatOutFactory(){ }

    ChatOutFactory.prototype =  {
        w : function(args){
            this.msg(args, "add", "private");
        },

        whisper : function(args){
            this.msg(args, "add", "private");
            return true;
        },

        add : function(args){
            this.msg(args, "add", "room");
            return true;
        },

        remove : function(args){
            this.msg(args, "remove", "room");
            return true;
        },

        join : function(args){
            this.room(args, "join");
            return true;
        },
        leave : function(args){
            this.room(args, "leave");
            return true;
        },

        msg : function(args, method, toType){

            var data  = {
                "m" : 'msg',
                "d" : {
                    "m" : method,
                    "d" : {
                        "toType" : toType,
                        "to" : args[0],
                        "from" : Authorization.getUser().id,
                        "msg" : args.splice(1).join(" ")
                    }
                }
            };

            WebSocket.Primus.write({"m": "chat", "d":data});

            return true;
        },

        room : function(args, action){
            var user = Authorization.getUser();
            var data  = {
                "m" : 'room',
                "d" : {
                    "m" : action,
                    "d" : {
                        "name" : args[0],
                        "type" : 'chat',
                        "username" : {username : user.username, id : user.id}
                    }
                }
            };
            WebSocket.Primus.write({"m": "chat", "d":data});
            return true;
        }

    };

    return ChatOutFactory;
}