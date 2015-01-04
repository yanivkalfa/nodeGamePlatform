/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .controller('adminController', [
        '$scope',
        '$state',
        adminController
    ]);

function adminController($scope, $state, principal) {}