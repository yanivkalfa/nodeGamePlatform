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
     * @extends Entity
     * @api public
     */
    function PongEntity(opts, game){
        window.game.class.Entity.apply(this,arguments);

        /**
         * holds mesh
         *
         * @type {Object}
         * @api public
         */
        this.mesh = opts.mesh || {};
    }

    PongEntity.prototype = Object.create(window.game.class.Entity.prototype);
    PongEntity.prototype.constructor = PongEntity;


    /**
     * Init entity
     *
     * @override
     * @api public
     */
    PongEntity.prototype.init = function(){
        this.game.loader.add(this);
    };


    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.PongEntity = PongEntity;
})();
