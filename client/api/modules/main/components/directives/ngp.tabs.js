/**
 * Created by Yaniv-Kalfa on 1/19/15.
 */
/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .directive('ngpTabContent', [ngpTabContent]);

function ngpTabContent() {

    console.log(ngp.const.app.url + '/tpl/directives/tabContent.html');
    return {
        templateUrl: ngp.const.app.url + '/tpl/directives/tabContent.html'
    };
}