/**
 * Created by Yaniv-Kalfa on 1/19/15.
 */
angular.module(ngp.const.app.name)
    .directive('ngpRoomMsgWrap',['$rootScope', ngpRoomContent]);

function ngpRoomContent($rootScope) {

    console.log($rootScope);

    return {
        link: function (scope, element, attrs) {
            console.log(scope, element, attrs);
        }
    };
}