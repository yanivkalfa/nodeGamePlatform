/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('RoutMsg', [
        '$rootScope',
        'Router',
        'Authorization',
        'Chat',
        'UtilFunc',
        RoutMsg
    ]);

function RoutMsg($rootScope, Router, Authorization, Chat, UtilFunc) {

    function RoutMsgFactory(){
        Router.apply(this, arguments);
    }

    RoutMsgFactory.prototype = Object.create(Router.prototype);
    RoutMsgFactory.prototype.constructor = RoutMsgFactory;

    RoutMsgFactory.prototype.warningMsg  = function(msg){
        switch(msg.action){
            case 'add':
                var activeIndex = Chat.getActiveRoom();
                msg.formatDate = UtilFunc.formatMsgDate(msg.date);
                Chat.addMsg(msg, $rootScope.ngp.rooms[activeIndex]);
                break;

            case 'remove':
                break;
        }
        $rootScope.$apply();
    };

    RoutMsgFactory.prototype.privateMsg  = function(msg){
        console.log(msg);

        /*
        var user = Authorization.getUser();
        switch(msg.action){
            case 'add':
                if(user.id == msg.from.id) {
                    //msg.from.username = 'to :' + msg.to.username;
                }

                var activeIndex = Chat.getActiveRoom();
                msg.formatDate = UtilFunc.formatMsgDate(msg.date);
                console.log('aaa', msg);
                Chat.addMsg(msg, $rootScope.ngp.rooms[activeIndex]);
                break;

            case 'remove':
                break;
        }
        $rootScope.$apply();
        */
    };

    RoutMsgFactory.prototype.publicMsg = function(msg){

        var rIndex = Chat.indexOf(msg.to);
        switch(msg.action){
            case 'add':
                msg.formatDate = UtilFunc.formatMsgDate(msg.date);
                Chat.addMsg(msg, $rootScope.ngp.rooms[rIndex]);
                break;

            case 'remove':
                Chat.removeMsg(msg, $rootScope.ngp.rooms[rIndex]);
                break;
        }
        $rootScope.$apply();
    };

    return RoutMsgFactory;
}