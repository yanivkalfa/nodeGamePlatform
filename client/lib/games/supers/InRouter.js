(function(){

    /**
     *
     * @param {Game} game
     *
     * @api public
     */
    function InRouter(game){

        /**
         * Holds ref to game object
         *
         * @type {Game}
         * @api public
         */
        this.game = game || {};
    }

    /**
     * Init inRouter
     *
     * @api public
     */
    InRouter.prototype.init = function(){
        var self = this;
        this.game.primus.on('data', function(msg){
            console.log(msg);
            self[msg.m](msg.d);
        });
    };


    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.InRouter = InRouter;
})();