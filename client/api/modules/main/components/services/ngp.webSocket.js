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
    }

    WebSocket.prototype =  {
        init : function(){
            this.Primus = Primus.connect('ws://mygametests.info/?token=' + token);
        }

    };


    return new WebSocket();
}