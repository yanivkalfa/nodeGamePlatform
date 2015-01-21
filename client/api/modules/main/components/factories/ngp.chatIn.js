/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('ChatIn', [
        '$q',
        '$rootScope',
        'WebSocket',
        'User',
        'UtilFunc',
        ChatIn
    ]);

function ChatIn($q, $rootScope, WebSocket,User, UtilFunc) {

    function ChatInFactory(){ }

    ChatInFactory.prototype =  {

        init : function(){
            var self = this;
            WebSocket.chat = function(msg){ self[msg.m](msg.d); };
            return self;
        },

        initChat : function(data){
            $rootScope.ngp.channels = data;

            _($rootScope.ngp.channels).forEach(function(channel, chanIndex){
                _(channel.content.msg).forEach(function(msg, msgIndex){
                    msg.formatDate = UtilFunc.formatMsgDate(msg.data);
                });
            });
        },

        getChanDetails : function(data){
            /*
            $rootScope.ngp.channels = data;

            _($rootScope.ngp.channels).forEach(function(channel, chanIndex){
                _(channel.content.msg).forEach(function(msg, msgIndex){
                    msg.formatDate = UtilFunc.formatMsgDate(msg.data);
                });
            });

            */
        },

        join : function(data){


        },

        leave : function(data){

        },

        message : function(data){

        }

    };

    return new ChatInFactory();
}