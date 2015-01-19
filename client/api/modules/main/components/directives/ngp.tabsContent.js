/**
 * Created by Yaniv-Kalfa on 1/19/15.
 */
angular.module(ngp.const.app.name)
    .directive('ngpTabContent',[ngpTabContent]);

function ngpTabContent() {

    return {
        scope: {
            content: '='
        },
        templateUrl: ngp.const.app.url + '/tpl/directives/tabsContent.html'
    };
}