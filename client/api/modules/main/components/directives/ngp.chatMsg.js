/**
 * Created by Yaniv-Kalfa on 1/19/15.
 */
angular.module(ngp.const.app.name)
    .directive('ngpChatMsg',['$scope',ngpChatMsg]);

function ngpChatMsg($scope) {
    console.log($scope);
    return {
        scope: {
            msg: '='
        },
        templateUrl: ngp.const.app.url + '/tpl/directives/chatMsg.html'
    };
}