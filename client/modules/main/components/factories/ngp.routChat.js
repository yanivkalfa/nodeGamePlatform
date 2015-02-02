/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .factory('RoutChat', [
        'Router',
        'RoutMsg',
        'RoutRoom',
        RoutChat
    ]);

function RoutChat(
    Router,
    RoutMsg,
    RoutRoom
    ) {

    function RoutChatFactory(){
        Router.apply(this, arguments);

        this.RoutMsg = new RoutMsg();
        this.RoutRoom = new RoutRoom();
    }

    RoutChatFactory.prototype = Object.create(Router.prototype);
    RoutChatFactory.prototype.constructor = RoutChatFactory;

    RoutChatFactory.prototype.msg = function(msg){
        this.RoutMsg.rout(msg);
    };

    RoutChatFactory.prototype.room = function(msg){
        this.RoutRoom.rout(msg);
    };

    return RoutChatFactory;
}