(function(){

    /**
     *
     * @param {Object} opts
     *  - `name` {String} Player name
     *  - `local` {Boolean} is local player or remote.
     *
     * @extends Entity
     * @api public
     */
    function Player(opts){
        window.game.class.Entity.apply(this,arguments);


        /**
         * Holds player name.
         *
         * @type {String}
         * @api public
         */
        this.name = opts.name || undefined;


        /**
         * Holds player type
         *
         * @type {String}
         * @api public
         */
        this.type = opts.type || undefined;

        /**
         * Holds local
         *
         * @type {Boolean}
         * @api public
         */
        this.local = opts.local || undefined;


        /**
         * Holds control
         *
         * @type {KeyBinds}
         * @api public
         */
        this.keyBinds = new window.game.class.KeyBinds();


        /**
         * Holds attributes
         *
         * @type {Attributes}
         * @api public
         */
        this.attributes = new window.game.class.Attributes();

        /**
         * Holds moves
         *
         * @type {Moves}
         * @api public
         */
        this.moves = undefined;


        /**
         * Holds collision
         *
         * @type {Collision}
         * @api public
         */
        this.collision = undefined;
    }

    Player.prototype = Object.create(window.game.class.Entity.prototype);
    Player.prototype.constructor = Player;


    /**
     * move player
     *
     * @override
     * @api public
     */
    Player.prototype.move = function(){
        var keyBinds = this.keyBinds.get()
            , i, l, m
            ;

        i = 0;
        l = keyBinds.length;

        for(i;i<l;i++){
            m = keyBinds[i](this.game);
            this.moves[m] && this.moves[m]();
        }
    };


    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.Player = Player;
})();
