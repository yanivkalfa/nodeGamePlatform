/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .factory('RoutMsg', [
        '$rootScope',
        'Router',
        'Authorization',
        'Chat',
        'UtilFunc',
        RoutMsg
    ]);

function RoutMsg(
    $rootScope,
    Router,
    Authorization,
    Chat,
    UtilFunc
    ) {

    function RoutMsgFactory(){
        Router.apply(this, arguments);
    }

    RoutMsgFactory.prototype = Object.create(Router.prototype);
    RoutMsgFactory.prototype.constructor = RoutMsgFactory;

    RoutMsgFactory.prototype.warningMsg  = function(msg){
        switch(msg.action){
            case 'add':
                var activeIndex = Chat.getActiveRoom();
                var room = $rootScope.ngp.rooms[activeIndex];
                msg.formatDate = UtilFunc.formatMsgDate(msg.date);
                Chat.addMsg(msg, room);
                break;

            case 'remove':
                break;
        }
        $rootScope.$apply();
        room.updateScroll();
    };

    RoutMsgFactory.prototype.privateMsg  = function(msg){
        var user = Authorization.getUser();
        switch(msg.action){
            case 'add':
                if(user.id == msg.from.id) {
                    msg.from.username = 'to :' + msg.to.username;
                }else{
                    msg.from.username = 'from :' + msg.from.username;
                }

                var activeIndex = Chat.getActiveRoom();
                var room = $rootScope.ngp.rooms[activeIndex];
                msg.formatDate = UtilFunc.formatMsgDate(msg.date);
                Chat.addMsg(msg, room);
                break;

            case 'remove':
                break;
        }
        $rootScope.$apply();
        room.updateScroll();
    };

    RoutMsgFactory.prototype.publicMsg = function(msg){
        var rIndex = Chat.indexOf(msg.to)
            , room = $rootScope.ngp.rooms[rIndex]
            ;
        switch(msg.action){
            case 'add':
                msg.formatDate = UtilFunc.formatMsgDate(msg.date);
                Chat.addMsg(msg, room);
                break;

            case 'remove':
                Chat.removeMsg(msg, room);
                break;
        }
        $rootScope.$apply();
        room.updateScroll();
    };

    return RoutMsgFactory;
}