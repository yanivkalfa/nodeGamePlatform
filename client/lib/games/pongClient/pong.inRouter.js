(function(){

    /**
     *
     * @param {Game} game
     *
     * @extend InRouter
     * @api public
     */
    function PongInRouter(game){
        window.game.class.InRouter.apply(this,arguments);
    }

    PongInRouter.prototype = Object.create(window.game.class.InRouter.prototype);
    PongInRouter.prototype.constructor = PongInRouter;


    /**
     * server sent game ready - and gave us entities details
     *
     * @param {Object} msg
     * @api public
     */
    PongInRouter.prototype.gr = function(msg){
        // adding entities/players and sending ready back

    };


    /**
     * server sent game starting in ... seconds
     *
     * @param {Object} msg
     * @api public
     */
    PongInRouter.prototype.gs = function(msg){
        // we start counter.

    };


    /**
     * server sends snapShots
     *
     * @param {Object} msg
     * @api public
     */
    PongInRouter.prototype.ss = function(msg){

    };

    // on game end server kills socket. and game, we kill game and go back to chat menu.

    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.InRouter = InRouter;
})();