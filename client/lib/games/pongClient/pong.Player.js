(function(){

    /**
     *
     * @param {Object} opts
     *  - `name` {String} Player name
     *  - `local` {Boolean} is local player or remote.
     *
     * @param {PongGame} game ref
     *
     * @extends PongEntity
     * @api public
     */
    function PongPlayer(opts, game){
        window.game.class.PongEntity.apply(this,arguments);


        /**
         * holds mesh
         *
         * @type {Object}
         * @api public
         */
        this.mesh = undefined;


        /**
         * Holds position relative in canvas.
         *
         * @type {Point}
         * @api public
         */
        this.position = this.opts.position || new window.game.class.Point(20, (this.game.canvas.height/2) - 50);


        /**
         * Holds dimensions
         *
         * @type {Object}
         * @api public
         */
        this.dimensions = this.opts.dimensions || {
            width  : 20,
            height  : 100
        };

        /**
         * Holds background
         *
         * @type {String}
         * @api public
         */
        this.background = 'white';


        /**
         * Holds player name.
         *
         * @type {String}
         * @api public
         */
        this.name = opts.name || undefined;

        /**
         * Holds local
         *
         * @type {Boolean}
         * @api public
         */
        this.local = opts.local || false;

        /**
         * Holds attributes
         *
         * @type {PongAttributes}
         * @api public
         */
        this.attributes = new window.game.class.PongAttributes();
    }

    PongPlayer.prototype = Object.create(window.game.class.PongEntity.prototype);
    PongPlayer.prototype.constructor = PongPlayer;


    /**
     * renders entity
     *
     * @override
     * @api public
     */
    PongPlayer.prototype.render = function(){
        this.node.style.top = this.position.y + 'px';
    };


    /**
     * loads entity
     *
     * @override
     * @api public
     */
    PongPlayer.prototype.load = function(){
        /*
        this.node = document.createElement("div");
        this.node.className = 'playerBox gameObject';
        this.node.id = 'entity_' + this.id;

        this.node.style.top = this.position.y + 'px';
        this.node.style.left = this.position.x + 'px';
        this.node.style.width = this.dimensions.width + 'px';
        this.node.style.height = this.dimensions.height + 'px';
        this.node.style.backgroundColor = this.background;

        this.game.canvas.node.appendChild(this.node);

        */
        this.game.loader.loaded(this);
    };


    /**
     * move player
     *
     * @param {Point} newPoint
     * @override
     * @api public
     */
    PongPlayer.prototype.move = function(newPoint){
        // calculating time difference and where the point is
        this.mesh.position.x = newPoint.x;
        this.mesh.position.y = newPoint.y;
        return this;
    };


    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.PongPlayer = PongPlayer;
})();
