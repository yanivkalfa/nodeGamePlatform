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
        this.init();
    }

    WebSocket.prototype =  {

        init : function(){

            if(!User.isAuthenticated) return false;

            var token = User.get().token;
            this.Primus = Primus.connect('ws://' + ngp.const.app.domain + '/?token=' + token);

            this.Primus.on('msg', function(msg){
                this[msg.method](msg.data);

            });

            return true;
        }

    };


    return new WebSocket();
}