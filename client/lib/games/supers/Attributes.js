(function(){

    /**
     * Holds player attributes
     *
     * @api public
     */
    function Attributes(){}

    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.Attributes = Attributes;
})();

/**
 * Holds player score
 *
 * @type {Number}
 * @api public
 */
this.score = 0;