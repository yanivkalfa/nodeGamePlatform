/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .service('WebSocket', [
            '$rootScope',
            '$q',
            'Authorization',
            'RoutChat',
            'RoutQueue',
            webSocket
        ]);

    function webSocket($rootScope, $q, Authorization, RoutChat, RoutQueue) {

        var routChat = new RoutChat();
        var routQueue = new RoutQueue();

        function WebSocketService(){
            this.Primus = false;
            this.connected = false;
            this.user = false;
        }

        WebSocketService.prototype =  {

            init : function(user){
                var deferred = $q.defer(),
                    self = this;

                console.log('websocket');

                this.user = Authorization.getUser();
                this.Primus = Primus.connect('ws://' + ngp.const.app.domain + '/?token=' + this.user.token);

                this.Primus2 = Primus.connect('ws://54.165.132.121:8001/?token=' + this.user.token);
                this.Primus.on('data', function(msg){
                    self[msg.m](msg.d);
                });

                this.Primus2.on('open', function open() {
                    console.log('connected to second server');
                });

                this.Primus.on('open', function open() {
                    self.connected = true;
                    console.log(self.Primus);
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
                routChat.rout(msg);
            },

            queue : function(msg){
                routQueue.rout(msg);
            },

            end : function(){ this.Primus.end(); },

            isConnected : function(){ return this.connected; }


        };

        return new WebSocketService();
    }
})();