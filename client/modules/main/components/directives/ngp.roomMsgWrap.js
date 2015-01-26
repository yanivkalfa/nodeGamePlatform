/**
 * Created by Yaniv-Kalfa on 1/19/15.
 */
angular.module(ngp.const.app.name)
    .directive('ngpRoomMsgWrap',['$rootScope', 'Chat', ngpRoomMsgWrap]);

function ngpRoomMsgWrap($rootScope,Chat) {

    return {
        link: function (scope, element, attrs) {
            console.log(scope, element, attrs);
            var raw = element[0];

            var rIndex = Chat.getActiveRoom()
                , room = $rootScope.ngp.rooms[rIndex];

            element.bind('scroll', function () {

                console.log("raw.scrollTop", raw.scrollTop, ' raw.offsetHeight: ', raw.offsetHeight);
                room.scrollFlag = raw.scrollTop + raw.offsetHeight >= raw.scrollTop;

                console.log(room.scrollFlag);
            });
        },
        scope: {
            content: '='
        },
        templateUrl: ngp.const.app.url + '/tpl/directives/roomMsgWrap.html'
    };
}