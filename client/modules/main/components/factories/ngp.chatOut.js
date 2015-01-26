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
            this.msg(args, 'privateMsg', 'add');
        },

        whisper : function(args){
            this.msg(args, 'privateMsg', 'add');
            return true;
        },

        add : function(args){
            this.msg(args, 'publicMsg', 'add');
            return true;
        },

        remove : function(args){
            this.msg(args, 'remove', 'remove');
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

        msg : function(args, method, action, id){

            var data  = {
                "m" : 'msg',
                "d" : {
                    "m" : method,
                    "d" : {
                        "id" : id,
                        "action" : action,
                        "to" : args[0],
                        "from" : Authorization.getUser().id,
                        "content" : args.splice(1).join(" ")
                    }
                }
            };

            //{id:'', date : '', formatDate : '', action:'', from : '', to : '', content: ''}

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
                        "id" : args[0],
                        "type" : 'chat',
                        "users" : {username : user.username, id : user.id}
                    }
                }
            };
            WebSocket.Primus.write({"m": "chat", "d":data});
            return true;
        }

    };

    return ChatOutFactory;
}