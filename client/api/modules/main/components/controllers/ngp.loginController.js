/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .controller('loginController', [
        '$scope',
        '$state',
        loginController
    ]);

function loginController($scope, $state, principal) {}