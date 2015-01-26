/**
 * Created by Yaniv-Kalfa on 1/19/15.
 */
angular.module(ngp.const.app.name)
    .directive('ngpRoomContent',[ngpRoomContent]);

function ngpRoomContent() {

    return {
        scope: {
            content: '=',
            room: '='
        },
        templateUrl: ngp.const.app.url + '/tpl/directives/roomContent.html'
    };
}