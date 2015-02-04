/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .factory('ChatOut', [
            'Terminal',
            'WebSocket',
            'Authorization',
            ChatOut
        ]);

    function ChatOut(
        Terminal,
        WebSocket,
        Authorization
        ) {

        function ChatOutFactory(){
            Terminal.apply(this, arguments);
        }

        ChatOutFactory.prototype = Object.create(Terminal.prototype);
        ChatOutFactory.prototype.constructor = ChatOutFactory;

        var prototypeExtend =  {
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
                this.msg(args, 'publicMsg', 'remove');
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

            msg : function(args, method, action){

                var data  = {
                    "m" : 'msg',
                    "d" : {
                        "m" : method,
                        "d" : {
                            "id" : args[1],
                            "action" : action,
                            "to" : args[0],
                            "from" : Authorization.getUser().id,
                            "content" : args.splice(1).join(" ")
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

        _.assign(ChatOutFactory.prototype, prototypeExtend);

        return new ChatOutFactory();
    }
})();