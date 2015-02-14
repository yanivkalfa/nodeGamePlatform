/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .controller('gameController', [
            '$stateParams',
            'Authorization',
            gameController
        ]);

    function gameController(
        $stateParams,
        Authorization
        ) {

        function GameController(){
            console.log( $stateParams, Authorization );
        }

        return new GameController();

    }
})();
