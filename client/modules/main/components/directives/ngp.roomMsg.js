/**
 * Created by Yaniv-Kalfa on 1/19/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .directive('ngpRoomMsg',[ngpRoomMsg]);

    function ngpRoomMsg() {
        return {
            scope: {
                msg: '='
            },
            templateUrl: ngp.const.app.url + '/tpl/directives/roomMsg.html'
        };
    }
})();