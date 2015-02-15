(function(){

    /**
     *
     * @param {Game} game
     * @api public
     */
    function Roles(game){

        /**
         * Holds ref to game object
         *
         * @type {Game}
         * @api public
         */
        this.game = game || {};
    }

    /**
     * go through Rules and invoke rule functions
     *
     * @api public
     */
    Roles.prototype.check = function(){};


    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.Roles = Roles;
})();