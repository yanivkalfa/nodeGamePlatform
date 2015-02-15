(function(){

    /**
     *
     * @param {Game} game
     *
     * @api public
     */
    function OutRouter(game){

        /**
         * Holds ref to game object
         *
         * @type {Game}
         * @api public
         */
        this.game = game || {};
    }

    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};

    window.game.class.OutRouter = OutRouter;
})();