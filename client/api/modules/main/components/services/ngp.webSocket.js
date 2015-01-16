/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

angular.module(ngp.const.app.name)
    .service('WebSocket', [
        '$rootScope',
        '$q',
        'User',
        webSocket
    ]);

function webSocket($rootScope, $q, User) {

    function WebSocket(){
        this.Primus = false;
        this.connected = false;
    }

    WebSocket.prototype =  {

        init : function(){
            var deferred = $q.defer(),
                self = this;

            if(!User.isAuthenticated) {
                deferred.reject( 'User is not authenticated' );
                return deferred.promise;
            }

            var token = User.get().token;
            this.Primus = Primus.connect('ws://' + ngp.const.app.domain + '/?token=' + token);
            this.Primus.on('data', function(msg){
                self[msg.m](msg.d);
            });


            this.Primus.on('open', function open() {
                self.connected = true;
                deferred.resolve( self );
            });

            this.Primus.on('error', function error(err) {
                self.connected = false;
                deferred.reject( err );
            });

            this.Primus.on('end', function end() { self.connected = false; });


            return deferred.promise;
        },

        end : function(){ this.Primus.end(); },

        isConnected : function(){ return this.connected; }


    };

    return new WebSocket();
}