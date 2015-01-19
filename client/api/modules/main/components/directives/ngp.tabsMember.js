/**
 * Created by Yaniv-Kalfa on 1/19/15.
 */
angular.module(ngp.const.app.name)
    .directive('ngpTabsMember',[ngpTabsMember]);

function ngpTabsMember() {
    return {
        scope: {
            member: '='
        },
        templateUrl: ngp.const.app.url + '/tpl/directives/tabsMember.html'
    };
}