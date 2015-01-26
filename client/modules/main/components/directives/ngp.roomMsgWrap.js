/**
 * Created by Yaniv-Kalfa on 1/19/15.
 */
angular.module(ngp.const.app.name)
    .directive('ngpRoomMsgWrap',['$rootScope', ngpRoomMsgWrap]);

function ngpRoomMsgWrap($rootScope) {

    console.log($rootScope);


    return {
        /*
        link: function (scope, element, attrs) {
            console.log(scope, element, attrs);
        },*/
        templateUrl: ngp.const.app.url + '/tpl/directives/roomMsgWrap.html'
    };
}