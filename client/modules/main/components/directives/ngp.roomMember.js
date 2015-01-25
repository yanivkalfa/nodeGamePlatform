/**
 * Created by Yaniv-Kalfa on 1/19/15.
 */
angular.module(ngp.const.app.name)
    .directive('ngpRoomMember',[ngpRoomMember]);

function ngpRoomMember() {
    return {
        scope: {
            member: '='
        },
        templateUrl: ngp.const.app.url + '/tpl/directives/roomMember.html'
    };
}