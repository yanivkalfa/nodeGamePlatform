/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

angular.module(ngp.const.app.name)
    .service('WebSocket', [
        '$rootScope',
        '$q',
        'Authorization',
        'RoutChat',
        'Latency',
        webSocket
    ]);

function webSocket($rootScope, $q, Authorization, RoutChat, Latency) {

    var RoutChat = new RoutChat();

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
            this.Primus.on('data', function(msg){
                self[msg.m](msg.d);
            });

            this.Primus.on('outgoing::ping', function(msg){
                Latency.outgoingPing(msg);
                console.log('outgoing');
            });

            this.Primus.on('incoming::pong', function(msg){
                Latency.incomingPong(msg);
                console.log(Latency.getLatency());
                $rootScope.ngp.bar.stats.latency = Latency.getLatency();
                $rootScope.$apply();
                console.log('incoming');
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
            RoutChat.rout(msg);
        },

        end : function(){ this.Primus.end(); },

        isConnected : function(){ return this.connected; }


    };

    return new WebSocketService();
}