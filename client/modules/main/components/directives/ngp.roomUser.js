/**
 * Created by Yaniv-Kalfa on 1/19/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .directive('ngpRoomUser',[ngpRoomUser]);

    function ngpRoomUser() {
        return {
            scope: {
                user: '='
            },
            templateUrl: ngp.const.app.url + '/tpl/directives/roomUser.html'
        };
    }
})();