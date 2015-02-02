/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .controller('gameQueueController', [
        gameQueueController
    ]);

function gameQueueController(
    ) {

    function GameQueueController(){
        var self = this;
    }

    GameQueueController.prototype.accept = function(){

    };

    return new GameQueueController();
}