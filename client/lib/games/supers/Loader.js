(function(){

    /**
     * Load entities
     *
     * @param {Game} game ref object
     * @param {Function} onload invoked once done loading
     * @extends Collection
     * @api public
     */
    function Loader(game, onload){
        window.game.class.Collection.apply(this,arguments);


        /**
         * Holds is done loading
         *
         * @type {Boolean}
         * @api public
         */
        this.isDoneLoading = false;



        /**
         * Holds function that get invoked once done loading
         *
         * @type {Function}
         * @api public
         */
        this.onload = onload || function noop(){};
    }

    Loader.prototype = Object.create(window.game.class.Collection.prototype);
    Loader.prototype.constructor = Loader;


    /**
     * Iterates over need loading and load them.
     *
     * @api public
     */
    Loader.prototype.load = function(){
        var needLoading, i, l;
        needLoading = this.get();
        this.isDoneLoading = false;
        l = needLoading.length;

        for (i = 0; i < l; i++) {
            needLoading[0].load();
        }
    };


    /**
     * check if all is loaded
     *
     * @api public
     */
    Loader.prototype.loaded = function(loaded){
        this.remove(loaded);
        if(this.get().length <= 0){
            this.isDoneLoading = true;
            this.onload();
        }
    };

    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.Loader = Loader;
})();
