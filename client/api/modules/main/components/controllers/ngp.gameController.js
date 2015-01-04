/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .controller('gameController', [
        '$scope',
        '$state',
        gameController
    ]);

function gameController($scope, $state, principal) {}