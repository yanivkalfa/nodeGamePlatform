(function(){
    var Vector = window.game.class.Vector;
    /**
     *
     * @param {Game} game
     * @param {Entity} entity
     * @api public
     */
    function Ai(game, entity){


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


        /**
         * Holds side (1 left, 2 right)
         *
         * @type {Number}
         * @api public
         */
        this.side = undefined;
        /**
         * Holds direction points
         *
         * @type {Array}
         * @api public
         */

        this.directions = [
            {x:5, y:-5},//upLeft
            {x:5, y:5},//downLeft
            {x:-5, y:-5},//upRight
            {x:-5, y:5}//downRight
            //new Vector(5,-5), //upLeft
            //new Vector(5,5), //downLeft
            //new Vector(-5,-5), //upRight
            //new Vector(-5,5)  //downRight
        ];
    }

    /**
     * Start entity's movement
     *
     * @api public
     */
    Ai.prototype.start = function(vector){
        this.changeDirection(vector);
    };


    /**
     * Stop entity's movement
     *
     * @api public
     */
    Ai.prototype.stop = function(){
        this.entity.moveDirection = {x:0, y:0};
    };


    /**
     * Reset entity's
     *
     * @api public
     */
    Ai.prototype.reset = function(){
        this.entity.moveDirection = {x:0, y:0};
        this.entity.position = this.entity.starPosition;
        this.entity.render();
    };


    /**
     * Change entity direction
     *
     * @param {Object} vector
     * @api public
     */
    Ai.prototype.changeDirection = function(vector){
        this.entity.moveDirection = vector;
    };


    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.Ai = Ai;
})();