(function(){

    /**
     * Load entities
     *
     * @param {Game} game ref object
     * @param {Function} onload invoked once done loading
     * @extends Loader
     * @api public
     */
    function PongLoader(game, onload){
        window.game.class.Loader.apply(this,arguments);
    }

    PongLoader.prototype = Object.create(window.game.class.Loader.prototype);
    PongLoader.prototype.constructor = PongLoader;


    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.PongLoader = PongLoader;
})();
