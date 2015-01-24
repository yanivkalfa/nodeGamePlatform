/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

angular.module(ngp.const.app.name)
    .service('WebSocket', [
        '$rootScope',
        '$q',
        'RoutChat',
        'Authorization',
        webSocket
    ]);

function webSocket($rootScope, $q, RoutChat,Authorization) {

    function WebSocketService(){
        this.Primus = false;
        this.connected = false;
        this.RoutChat = new RoutChat();
    }

    WebSocketService.prototype =  {

        init : function(){
            var deferred = $q.defer(),
                self = this;

            if(!Authorization.isAuthenticated) {
                deferred.reject( 'User is not authenticated' );
                return deferred.promise;
            }

            var token = Authorization.getUser().token;
            this.Primus = Primus.connect('ws://' + ngp.const.app.domain + '/?token=' + token);
            this.Primus.on('data', function(msg){
                console.log(msg);
                self[msg.m](msg.d);
            });

            /*
            var data  = {
                "m" : 'roomDo',
                "d" : {
                    "m" : 'join',
                    "d" : {
                        "name" : 'aRoomName',
                        "type" : 'chat',
                        "username" : Authorization.getUser().username
                    }
                }
            };
            this.Primus.write({"m": "chat", "d":data});
            */


            this.Primus.on('open', function open() {
                self.connected = true;
                deferred.resolve( self );
            });

            this.Primus.on('error', function error(err) {
                self.connected = false;
                deferred.reject( err );
            });

            this.Primus.on('end', function end() {
                self.connected = false;
            });


            return deferred.promise;
        },

        chat : function(msg){
            this.RoutChat.rout(msg);
        },

        end : function(){ this.Primus.end(); },

        isConnected : function(){ return this.connected; }


    };

    return new WebSocketService();
}