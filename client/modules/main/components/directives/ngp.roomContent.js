/**
 * Created by Yaniv-Kalfa on 1/19/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .directive('ngpRoomContent',[ngpRoomContent]);

    function ngpRoomContent() {

        return {
            scope: {
                content: '=',
                roomIndex: '='
            },
            templateUrl: ngp.const.app.url + '/tpl/directives/roomContent.html'
        };
    }
})();