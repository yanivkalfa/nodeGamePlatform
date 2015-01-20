/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
/*
angular.module(ngp.const.app.name)
    .service('InitChat', [
        '$q',
        '$scope',
        'WebSocket',
        'User',
        InitChat
    ]);

function InitChat($q, $scope, WebSocket,User) {

    console.log('aaaa');

    function InitChatService(){
        console.log('aaaaaa');
    }

    InitChatService.prototype =  {

        init : function(){

            var deferred = $q.defer(),
                self = this;

            WebSocket.Primus.write({"m": "initChat", "d":""});


            $scope.initChat = false;

            setTimeout(function(){
                if(!$scope.initChat) {
                    console.log('aaaa');
                    deferred.reject( 'There is some error with sockets' );
                    return deferred.promise;
                }
            }, 3000);


            WebSocket.initChat = function(data){
                $scope.initChat = true;
                $scope.channel = data;
                deferred.resolve( data );
            };

            return deferred.promise;
        }
    };

    return new InitChatService();
}
*/
angular.module(ngp.const.app.name)
    .service('InitChat', [
        '$q',
        '$rootScope',
        'WebSocket',
        'User',
        InitChat
    ]);

function InitChat($q, $rootScope, WebSocket, User) {

    function InitChatService(){

        this.init();
    }

    InitChatService.prototype =  {

        init : function(){
            console.log(WebSocket);
        }
    };

    return new InitChatService();
}
