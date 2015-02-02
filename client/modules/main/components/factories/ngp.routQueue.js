/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .factory('RoutQueue', [
        '$rootScope',
        'Router',
        RoutQueue
    ]);

function RoutQueue($rootScope,Router) {

    function RoutQueueFactory(){
        Router.apply(this, arguments);
    }

    RoutQueueFactory.prototype = Object.create(Router.prototype);
    RoutQueueFactory.prototype.constructor = RoutQueueFactory;


    RoutQueueFactory.prototype.ready = function(room){

    };

    RoutQueueFactory.prototype.leave = function(room){
    };

    return RoutQueueFactory;
}