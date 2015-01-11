/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

angular.module(ngp.const.app.name)
    .service('WebSocket', [
        '$rootScope',
        'User',
        webSocket
    ]);

function webSocket($rootScope, User) {


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


            this.Primus.on('open', function open() { self.connected = true; });

            this.Primus.on('end', function end() { self.connected = false; });


            return true;
        },

        end : function(){ this.Primus.end(); },

        isConnected : function(){ return this.connected; }


    };


    return new WebSocket();
}