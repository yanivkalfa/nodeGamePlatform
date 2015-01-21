/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('ChatOut', [
        '$q',
        '$rootScope',
        'WebSocket',
        'User',
        'UtilFunc',
        ChatOut
    ]);

function ChatOut($q, $rootScope, WebSocket,User, UtilFunc) {

    function ChatOutFactory(){ }

    ChatOutFactory.prototype =  {

        join : function(){
            WebSocket.Primus.write({"m": "chat", "d":"p"});
        },

        leave : function(data){
            $rootScope.ngp.channels = data;

            _($rootScope.ngp.channels).forEach(function(channel, chanIndex){
                _(channel.content.msg).forEach(function(msg, msgIndex){
                    msg.formatDate = UtilFunc.formatMsgDate(msg.data);
                });
            });
        },

        msg : function(data){
            /*
            $rootScope.ngp.channels = data;

            _($rootScope.ngp.channels).forEach(function(channel, chanIndex){
                _(channel.content.msg).forEach(function(msg, msgIndex){
                    msg.formatDate = UtilFunc.formatMsgDate(msg.data);
                });
            });

            */
        },

        getChannelDetails : function(data){


        }

    };

    return new ChatOutFactory();
}