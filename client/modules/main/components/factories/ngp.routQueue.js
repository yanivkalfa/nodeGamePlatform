/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .factory('RoutQueue', [
        '$rootScope',
        '$scope',
        'Router',
        RoutQueue
    ]);

function RoutQueue($rootScope,$scope,Router) {

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