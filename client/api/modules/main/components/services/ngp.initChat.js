/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('InitChat', [
        '$q',
        '$rootScope',
        'WebSocket',
        'User',
        'UtilFunc',
        InitChat
    ]);

function InitChat($q, $rootScope, WebSocket,User, UtilFunc) {

    function InitChatService(){ }

    InitChatService.prototype =  {

        init : function(){
            var deferred = $q.defer(), self = this;

            WebSocket.chat = function(msg){ self[msg.m](msg.d); };

            deferred.resolve( self );
            return deferred.promise;
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

    return new InitChatService();
}