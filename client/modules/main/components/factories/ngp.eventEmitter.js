/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .factory('EventEmitter', [function(){
        return ngp.oFns.EventEmitter;
    }]);