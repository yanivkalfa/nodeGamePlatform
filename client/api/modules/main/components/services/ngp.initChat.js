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

    function InitChatService(){}

    InitChatService.prototype =  {

        init : function(){

            var deferred = $q.defer(),
                self = this;

            if(!$rootScope.ngp.initChat){
                WebSocket.Primus.write({"m": "initChat", "d":""});
            }


            setTimeout(function(){
                if(!$rootScope.ngp.initChat) {
                    deferred.reject( 'There is some error with sockets' );
                    return deferred.promise;
                }
            }, 3000);


            WebSocket.initChat = function(data){
                $rootScope.ngp.initChat = true;
                $rootScope.ngp.channels = data;

                _($rootScope.ngp.channels).forEach(function(channel, chanIndex){
                    _(channel.content.msg).forEach(function(msg, msgIndex){
                        msg.formatDate = UtilFunc.formatMsgDate(msg.data);
                    });
                });

                deferred.resolve( data );
            };

            return deferred.promise;
        }
    };

    return new InitChatService();
}