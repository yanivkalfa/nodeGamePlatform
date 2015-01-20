/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('InitChat', [
        '$q',
        'WebSocket',
        'User',
        InitChat
    ]);

function InitChat($q, WebSocket,User) {

    console.log('aaaa');

    function InitChatService(){
        console.log('aaaaaa');
    }

    InitChatService.prototype =  {

        init : function(){

            var deferred = $q.defer(),
                self = this;

            WebSocket.Primus.write({"m": "initChat", "d":""});


            ngp.const.app.rootScope.initChat = false;

            setTimeout(function(){
                if(!ngp.const.app.rootScope.initChat) {
                    console.log('aaaa');
                    deferred.reject( 'There is some error with sockets' );
                    return deferred.promise;
                }
            }, 3000);


            WebSocket.initChat = function(data){
                ngp.const.app.rootScope.initChat = true;
                ngp.const.app.rootScope.channels = data;
                deferred.resolve( data );
            };

            return deferred.promise;
        }
    };

    return new InitChatService();
}