/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('ChatOut', [
        '$q',
        '$rootScope',
        'WebSocket',
        'Authorization',
        'User',
        'UtilFunc',
        ChatOut
    ]);

function ChatOut($q, $rootScope, WebSocket, Authorization,User, UtilFunc) {

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

        join : function(){
            WebSocket.Primus.write({"m": "chat", "d":"p"});
        },


        leave : function(data){ },

        msg : function(args, action, toType){
            var toEmit = {
                "m" : 'msg',
                "a" : action,
                "d" : {
                    "toType" : toType,
                    "to" : args[0],
                    "from" : Authorization.getUser().id,
                    "date" : '',
                    "msg" : args.splice(1).join(" ")
                }
            };

            WebSocket.Primus.write({"m": "chat", "d":toEmit});
            return true;
        },

        getRoomDetails : function(data){


        }

    };

    return new ChatOutFactory();
}