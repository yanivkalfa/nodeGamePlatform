/**
 * Created by Yaniv-Kalfa on 1/19/15.
 */
angular.module(ngp.const.app.name)
    .directive('ngpRoomMsgWrap',['$rootScope', 'Chat', ngpRoomMsgWrap]);

function ngpRoomMsgWrap($rootScope,Chat) {

    return {
        link: function (scope, element, attrs) {
            var raw = element[0]
                , rIndex = Chat.getActiveRoom()
                , room = $rootScope.ngp.rooms[rIndex]
                ;

            room.msgWrap = element[0];


            setInterval(function(){
                room.scrollBottom();
            }, 1000);

            element.bind('scroll', function () {
                room.scrollFlag = raw.scrollTop + raw.offsetHeight >= raw.scrollHeight;
            });
        },
        scope: {
            content: '='
        },
        templateUrl: ngp.const.app.url + '/tpl/directives/roomMsgWrap.html'
    };
}