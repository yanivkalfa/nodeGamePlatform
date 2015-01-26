/**
 * Created by Yaniv-Kalfa on 1/19/15.
 */
angular.module(ngp.const.app.name)
    .directive('ngpRoomMsgWrap',['$rootScope', ngpRoomMsgWrap]);

function ngpRoomMsgWrap($rootScope) {

    console.log($rootScope);


    return {
        link: function (scope, element, attrs) {
            console.log(scope, element, attrs);
            var raw = element[0];
            console.log(raw, raw.scrollTop);

            element.bind('scroll', function () {
                console.log(raw.scrollTop);

                /*if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight) {
                    //scope.$apply(attrs.scrolly);
                }*/
            });
        },
        scope: {
            content: '='
        },
        templateUrl: ngp.const.app.url + '/tpl/directives/roomMsgWrap.html'
    };
}