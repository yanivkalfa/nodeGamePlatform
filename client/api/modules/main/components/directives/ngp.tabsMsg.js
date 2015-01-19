/**
 * Created by Yaniv-Kalfa on 1/19/15.
 */
angular.module(ngp.const.app.name)
    .directive('ngpTabsMsg',[ngpTabsMsg]);

function ngpTabsMsg() {
    return {
        scope: {
            msg: '='
        },
        templateUrl: ngp.const.app.url + '/tpl/directives/tabsMsg.html'
    };
}