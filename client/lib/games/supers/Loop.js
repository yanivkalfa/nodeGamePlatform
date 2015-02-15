(function(){


    /**
     * Loop through collection and invoke function within it
     *
     * @param {Object} opts
     *  - `cycleEvery` {Number} How often cycle will be executed in mili-seconds
     *  -
     *
     * @param {Game} game ref object
     * @extends Collection
     * @api public
     */
    function Loop(game , opts){
        window.game.class.Collection.apply(this,arguments);


        /**
         * Holds references.
         *
         * @type {List}
         * @api public
         */
        this.references = new window.game.class.List();


        /**
         * Holds loop interval.
         *
         * @type {Number}
         * @api public
         */
        this.interval = undefined;


        /**
         * Holds the interval cycle will run in mili-seconds
         *
         * @type {Number}
         * @api public
         */
        this.cycleEvery = opts.cycleEvery || 0;


        /**
         * Holds ref to game object
         *
         * @type {Game}
         * @api public
         */
        this.game = game || {};


        /**
         * Holds now time
         *
         * @type {Date}
         * @api public
         */
        this.now = undefined;


        /**
         * Holds then time
         *
         * @type {Date}
         * @api public
         */
        this.then = undefined;
    }

    Loop.prototype = Object.create(window.game.class.Collection.prototype);
    Loop.prototype.constructor = Loop;


    /**
     * Starts cycle interval
     *
     * @api public
     */
    Loop.prototype.start = function(){
        var self = this;
        this.then = Date.now();
        this.interval = setInterval(function(){
            self.cycle();
        },self.cycleEvery);
    };


    /**
     * Stops cycle interval
     *
     * @api public
     */
    Loop.prototype.stop = function(){
        clearInterval(this.interval);
    };


    /**
     * Stops cycle interval and clear interval value
     *
     * @api public
     */
    Loop.prototype.reset = function(){
        this.stop();
        this.interval = undefined;
        this.clear();
        this.references.clear();
    };


    /**
     * Cycle over added functions
     *
     * @api public
     */
    Loop.prototype.cycle = function(){
        var Collection = this.get()
            , i, l, fnWrap
            ;

        l = Collection.length;
        i = 0;

        this.now = Date.now();
        this.game.cycleTook = (this.now - this.then) / 1000;

        for (i; i < l; i++) {
            fnWrap = Collection[i];
            if('undefined' !== typeof fnWrap){
                fnWrap.ref[fnWrap.fn](fnWrap.args);
            }
        }

        this.then = this.now;
    };

    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.Loop = Loop;
})();

