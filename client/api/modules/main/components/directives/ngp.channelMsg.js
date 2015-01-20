/**
 * Created by Yaniv-Kalfa on 1/19/15.
 */
angular.module(ngp.const.app.name)
    .directive('ngpChannelMsg',[ngpChannelMsg]);

function ngpChannelMsg() {
    return {
        scope: {
            msg: '='
        },
        templateUrl: ngp.const.app.url + '/tpl/directives/channelMsg.html'
    };
}