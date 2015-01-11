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
    var deferred = $q.defer(),
        tmp;


    function WebSocket(){
        this.Primus = false;
        this.connected = false;

        this.init();
    }

    WebSocket.prototype =  {

        init : function(){
            var self = this;

            if(!User.isAuthenticated) return false;

            var token = User.get().token;
            this.Primus = Primus.connect('ws://' + ngp.const.app.domain + '/?token=' + token);
            this.Primus.on('data', function(msg){
                self[msg.method](msg.data);
            });


            this.Primus.on('open', function open() {
                console.log('open');
                self.connected = true;
                deferred.resolve( self );
            });

            this.Primus.on('error', function error(err) {
                self.connected = false;
                deferred.reject( err );
            });

            this.Primus.on('end', function end() { self.connected = false; });


            return true;
        },

        end : function(){ this.Primus.end(); },

        isConnected : function(){ return this.connected; }


    };

    tmp = new WebSocket();

    return deferred.promise;
}