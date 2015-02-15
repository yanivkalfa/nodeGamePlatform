/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .controller('queueReadyController', [
            '$scope',
            '$modalInstance',
            'game',
            queueReadyController
        ]);

    function queueReadyController(
        $scope,
        $modalInstance,
        game
        ) {
        $scope.game = game;
    }
})();
