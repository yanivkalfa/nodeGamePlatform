/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('RoutMsg', [
        'Router',
        RoutMsg
    ]);

function RoutMsg(Router) {

    function RoutMsgFactory(){
        Router.apply(this, arguments);
    }

    RoutMsgFactory.prototype = Object.create(Router.prototype);
    RoutMsgFactory.prototype.constructor = RoutMsgFactory;

    RoutMsgFactory.prototype.add = function(msg){

    };

    RoutMsgFactory.prototype.remove = function(msg){

    };

    return RoutMsgFactory;
}