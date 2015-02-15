(function(){

    /**
     *
     * @param {Game} game
     * @param {Entity} entity
     * @api public
     */
    function Collision(game, entity){


        /**
         * Holds ref to game object
         *
         * @type {Game}
         * @api public
         */
        this.game = game || {};


        /**
         * Holds entity
         *
         * @type {Entity}
         * @api public
         */
        this.entity = entity || {};
    }


    /**
     * Moves entity in the left direction
     *
     * @api public
     */
    Collision.prototype.check = function(nextPoint, moveDist, movDir){
        return {x:nextPoint.x, y:nextPoint.y}
    };


    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.Collision = Collision;
})();