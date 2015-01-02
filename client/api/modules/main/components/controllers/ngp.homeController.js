/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .controller('homeController', [
        '$scope',
        '$state',
        homeController
    ]);

function homeController($scope, $state, principal) {
    alert('got home');
}