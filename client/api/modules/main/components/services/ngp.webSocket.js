/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

angular.module(ngp.const.app.name)
    .service('WebSocket', [
        '$rootScope',
        'User',
        WebSocket
    ]);

function WebSocket($rootScope, User) {
    this.Primus = false;
    this.init();
    this.user = User;

}

WebSocket.prototype =  {

    init : function(){

        if(!this.user.isAuthenticated) return false;

        var token = this.user.get().token;
        this.Primus = Primus.connect('ws://' + ngp.const.app.domain + '/?token=' + token);

        this.Primus.on('msg', function(msg){
            this[msg.method](msg.data);

        });

        return true;
    }

};