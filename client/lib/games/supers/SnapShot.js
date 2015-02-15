(function(){


    /**
     * take game snapshot at a certain interval
     *
     * @param {Object} opts
     *  - `SnapEvery` {Number} How often to take a snapshot
     *  -
     *
     * @param {Game} game ref object
     * @extends Collection
     * @api public
     */
    function SnapShot(game , opts){


        /**
         * Holds ref to game object
         *
         * @type {Game}
         * @api public
         */
        this.game = game || {};


        /**
         * Holds snapshot interval.
         *
         * @type {Number}
         * @api public
         */
        this.interval = undefined;


        /**
         * Holds the interval snapshot will be taken
         *
         * @type {Number}
         * @api public
         */
        this.SnapEvery = opts.SnapEvery || 10;


        /**
         * Holds snapShots count
         *
         * @type {Number}
         * @api public
         */
        this.snapShots = 0;
    }


    /**
     * Starts snapshot interval
     *
     * @api public
     */
    SnapShot.prototype.start = function(){
        var self = this;
        this.interval = setInterval(function(){
            self.snapshot();
        },self.snapShots);
    };


    /**
     * Stops snapshot interval
     *
     * @api public
     */
    SnapShot.prototype.stop = function(){
        clearInterval(this.interval);
    };


    /**
     * Stops snapshot interval and clear interval value
     *
     * @api public
     */
    SnapShot.prototype.reset = function(){
        this.stop();
        this.interval = undefined;
    };


    /**
     * Take games snapshot
     *
     * @api public
     */
    SnapShot.prototype.snapshot = function(){

    };


    /**
     * Send snapshot to clients
     *
     * @api public
     */
    SnapShot.prototype.transferSnapshot = function(){

    };

    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.SnapShot = SnapShot;
})();

