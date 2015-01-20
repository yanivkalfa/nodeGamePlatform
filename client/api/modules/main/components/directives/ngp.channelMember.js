/**
 * Created by Yaniv-Kalfa on 1/19/15.
 */
angular.module(ngp.const.app.name)
    .directive('ngpChannelMember',[ngpChannelMember]);

function ngpChannelMember() {
    return {
        scope: {
            member: '='
        },
        templateUrl: ngp.const.app.url + '/tpl/directives/channelMember.html'
    };
}