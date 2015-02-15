(function(){

    /**
     *
     * @param {Object} opts
     *  - `id` {Number} entity id
     *  - `node` {Node} DOM node.
     *  - `position` {Point} entity position
     *  - `dimensions` {Object} entity dimensions
     *  - `moveDistance` {Number} move distance
     *  - `velocityModifier` {Number} velocity modifier
     *  - `acceleration` {Number} acceleration modifier
     *  - `type` {String} Player type
     *
     * @param {Game} game ref
     * @api public
     */
    function Entity(opts, game){


        /**
         * Holds options
         *
         * @type {Object}
         * @api public
         */
        this.opts = opts || {};


        /**
         * Holds ref to game object
         *
         * @type {Game}
         * @api public
         */
        this.game = game || undefined;


        /**
         * Holds player id.
         *
         * @type {Number}
         * @api public
         */
        this.id = this.opts.id || undefined;


        /**
         * Holds entity type
         *
         * @type {String}
         * @api public
         */
        this.type = opts.type || undefined;


        /**
         * Holds ref to DOM node.
         *
         * @type {Node}
         * @api public
         */
        this.node  = this.opts.node || undefined;


        /**
         * Holds position relative in canvas.
         *
         * @type {Point}
         * @api public
         */
        this.position = this.opts.position || new window.game.class.Point(0,0);


        /**
         * Holds start position relative in canvas.
         *
         * @type {Point}
         * @api public
         */
        this.starPosition = this.opts.starPosition || new window.game.class.Point(0,0);


        /**
         * Holds dimensions
         *
         * @type {Object}
         * @api public
         */
        this.dimensions = this.opts.dimensions || {
            width  : undefined,
            height  : undefined
        };


        /**
         * Holds velocity
         *
         * @type {Vector}
         * @api public
         */
        this.velocity = new window.game.class.Vector(0,0);


        /**
         * Holds velocity modifier
         *
         * @type {Number}
         * @api public
         */
        this.velocityModifier = opts.velocityModifier || 600;


        /**
         * Holds acceleration modifier
         *
         * @type {Number}
         * @api public
         */
        this.acceleration = opts.acceleration || 0;


        /**
         * Holds move distance scale
         *
         * @type {Number}
         * @api public
         */
        this.moveDistanceScale = this.opts.moveDistanceScale || 1;


        /**
         * Holds move distance
         *
         * @type {Number}
         * @api public
         */
        this.moveDistance = this.opts.moveDistance || 5;


        /**
         * Holds moveDirection
         *
         * @type {Object}
         * @api public
         */
        this.moveDirection = new window.game.class.Vector(0,0);

        /**
         * Holds need rendering
         *
         * @type {Boolean}
         * @api public
         */
        this.needRendering = false;


        /**
         * Holds background
         *
         * @type {String}
         * @api public
         */
        this.background = undefined;
    }

    /**
     * initiates entity
     *
     * @api public
     */
    Entity.prototype.init = function(){
        this.game.loader.add(this);
        this.game.renderer.add(this);
    };


    /**
     * renders entity
     *
     * @api public
     */
    Entity.prototype.render = function(){};


    /**
     * loads entity
     *
     * @api public
     */
    Entity.prototype.load = function(){};


    /**
     * moves entity
     *
     * @api public
     */
    Entity.prototype.move = function(){};


    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.Entity = Entity;
})();
