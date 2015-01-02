/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module('main', ['ui.router']).controller('homeController', ['$scope', '$state', homeController]);

function homeController($scope, $state, principal) {
    alert('got home');
}