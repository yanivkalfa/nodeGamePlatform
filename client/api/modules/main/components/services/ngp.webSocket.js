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
        this.init = function(){

            if(!User.isAuthenticated) return false;

            var token = User.get().token;
            this.Primus = Primus.connect('ws://' + ngp.const.app.domain + '/?token=' + token);
            this.Primus.on('data', function(msg){
                console.log(this);
                this[msg.method](msg.data);

            });

            return true;
        };

        this.init();
    }


    return new WebSocket();
}