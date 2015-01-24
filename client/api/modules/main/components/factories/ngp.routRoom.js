/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('RoutRoom', [
        '$rootScope',
        'UtilFunc',
        'Router',
        RoutRoom
    ]);

function RoutRoom($rootScope, UtilFunc, Router) {

    function RoutRoomFactory(){
        Router.apply(this, arguments);
    }

    RoutRoomFactory.prototype = Object.create(Router.prototype);
    RoutRoomFactory.prototype.constructor = RoutRoomFactory;


    RoutRoomFactory.prototype.join = function(msg){
        console.log('join', msg);
    };

    RoutRoomFactory.prototype.leave = function(msg){

    };

    RoutRoomFactory.prototype.getRooms = function(msg){
        $rootScope.ngp.channels = msg;

        _($rootScope.ngp.channels).forEach(function(channel, chanIndex){
            _(channel.content.msg).forEach(function(msg, msgIndex){
                msg.formatDate = UtilFunc.formatMsgDate(msg.data);
            });
        });
    };

    RoutRoomFactory.prototype.getRoom = function(msg){
        console.log('getRoom', msg);
    };

    return RoutRoomFactory;
}