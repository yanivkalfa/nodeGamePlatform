/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

angular.module(ngp.const.app.name)
    .service('WebSocket', [
        '$rootScope',
        '$q',
        'RoutChat',
        webSocket
    ]);

function webSocket($rootScope, $q, RoutChat) {

    function WebSocketService(){
        this.Primus = false;
        this.connected = false;
        this.RoutChat = new RoutChat();
        this.user = false;
    }

    WebSocketService.prototype =  {

        init : function(user){
            var deferred = $q.defer(),
                self = this;

            this.user = user;
            this.Primus = Primus.connect('ws://' + ngp.const.app.domain + '/?token=' + this.user.token);
            this.Primus.on('data', function(msg){
                console.log(msg);
                self[msg.m](msg.d);
            });

            var data  = {
                "m" : 'room',
                "d" : {
                    "m" : 'join',
                    "d" : {
                        "name" : 'lobby',
                        "type" : 'chat',
                        "username" : {username : this.user.username, id : this.user.id}
                    }
                }
            };
            this.Primus.write({"m": "chat", "d":data});

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

        destroy : function(){
            this.Primus.end();
        },

        chat : function(msg){
            this.RoutChat.rout(msg);
        },

        end : function(){ this.Primus.end(); },

        isConnected : function(){ return this.connected; }


    };

    return new WebSocketService();
}