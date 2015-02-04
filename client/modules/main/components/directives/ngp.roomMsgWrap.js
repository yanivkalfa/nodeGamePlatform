/**
 * Created by Yaniv-Kalfa on 1/19/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .directive('ngpRoomMsgWrap',['$rootScope', 'Chat', ngpRoomMsgWrap]);

    function ngpRoomMsgWrap($rootScope,Chat) {

        return {
            link: function (scope, element, attrs) {
                var room = $rootScope.ngp.rooms[attrs.roomIndex];
                room.msgWrap = element[0];

                element.bind('scroll', function () {
                    room.scrollFlag = room.msgWrap.scrollTop + room.msgWrap.offsetHeight >= room.msgWrap.scrollHeight;
                });
            },
            scope: {
                content: '='
            },
            templateUrl: ngp.const.app.url + '/tpl/directives/roomMsgWrap.html'
        };
    }
})();