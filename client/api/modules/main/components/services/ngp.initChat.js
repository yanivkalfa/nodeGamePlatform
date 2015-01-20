/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('InitChat', [
        '$q',
        '$rootScope',
        'WebSocket',
        'User',
        InitChat
    ]);

function InitChat($q, $rootScope, WebSocket,User) {

    function InitChatService(){}

    InitChatService.prototype =  {

        init : function(){

            var deferred = $q.defer(),
                self = this;

            WebSocket.Primus.write({"m": "initChat", "d":""});
            $rootScope.ngp.initChat = false;

            setTimeout(function(){
                if(!$rootScope.ngp.initChat) {
                    console.log('aaaa');
                    deferred.reject( 'There is some error with sockets' );
                    return deferred.promise;
                }
            }, 3000);


            WebSocket.initChat = function(data){
                $rootScope.ngp.initChat = true;
                $rootScope.ngp.channel = data;
                deferred.resolve( data );
            };

            return deferred.promise;
        }
    };

    return new InitChatService();
}