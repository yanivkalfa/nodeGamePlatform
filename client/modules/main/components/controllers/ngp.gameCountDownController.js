/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .controller('gameCountDownController', [
            '$scope',
            '$modalInstance',
            'game',
            gameCountDownController
        ]);

    function gameCountDownController(
        $scope,
        $modalInstance,
        game
        ) {
        $scope.game = game;
    }
})();
