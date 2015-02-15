(function(){

    /**
     *
     * @param {Game} game
     *
     * @extend OutRouter
     * @api public
     */
    function PongOutRouter(game){
        window.game.class.OutRouter.apply(this,arguments);
    }

    PongOutRouter.prototype = Object.create(window.game.class.OutRouter.prototype);
    PongOutRouter.prototype.constructor = PongOutRouter;


    /**
     * We send game join with out details.
     *
     * @param {Object} msg
     * @api public
     */
    PongOutRouter.prototype.j = function(msg){

    };


    /**
     * We send loaded ones done loading and adding entities
     *
     * @param {Object} msg
     * @api public
     */
    PongOutRouter.prototype.l = function(msg){
        // server remove queues/ we remove queues from JS

    };


    /**
     * We send key strokes
     *
     * @param {Object} msg
     * @api public
     */
    PongOutRouter.prototype.ks = function(msg){
        console.log(msg);
    };

    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};

    window.game.class.PongOutRouter = PongOutRouter;
})();