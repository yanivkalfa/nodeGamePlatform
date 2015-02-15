(function(){

    /**
     * Holds player attributes
     *
     * @api public
     */
    function PongAttributes(){
        window.game.class.Attributes.apply(this,arguments);

        /**
         * Holds player score
         *
         * @type {Number}
         * @api public
         */
        this.score = 0;
    }

    PongAttributes.prototype = Object.create(window.game.class.Attributes.prototype);
    PongAttributes.prototype.constructor = PongAttributes;

    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.PongAttributes = PongAttributes;
})();