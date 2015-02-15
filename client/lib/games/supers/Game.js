(function(){

    /**
     * Basic game class
     *
     * @param {Object} opts
     *  - `canvas` {Object} canvas details
     *  - `cycle` {Object} cycle details
     *  - `type` {String} Game type
     *  - `name` {String} Game name
     *
     * @api public
     */
    function Game(opts){


        /**
         * Holds options
         *
         * @type {Object}
         * @api public
         */
        this.opts = opts || {};


        /**
         * Holds reference to game entities
         *
         * @type {List}
         * @api public
         */
        this.entities = undefined;


        /**
         * Holds our timers
         *
         * @type {Loop}
         * @api public
         */
        this.mainLoop = undefined;


        /**
         * Holds players
         *
         * @type {List}
         * @api public
         */
        this.players = undefined;


        /**
         * Holds renderer
         *
         * @type {Renderer}
         * @api public
         */
        this.renderer = undefined;


        /**
         * Holds loader
         *
         * @type {Loader}
         * @api public
         */
        this.loader = undefined;


        /**
         * Holds scoreBoard
         *
         * @type {ScoreBoard}
         * @api public
         */
        this.scoreBoard = undefined;


        /**
         * Holds moves
         *
         * @type {Moves}
         * @api public
         */
        this.moves = undefined;


        /**
         * Holds game Type
         *
         * @type {String}
         * @api public
         */
        this.type = this.opts.type || undefined;


        /**
         * Holds game name
         *
         * @type {String}
         * @api public
         */
        this.name = this.opts.name || undefined;


        /**
         * Holds canvas details
         *
         * @type {Object}
         * @api public
         */
        this.canvas = this.opts.canvas || {
            node : undefined,
            width : 0,
            height : 0
        };


        /**
         * Holds required players
         *
         * @type {Number}
         * @api public
         */
        this.requirePlayers = this.opts.requirePlayers || 2;


        /**
         * Holds keysPressed
         *
         * @type {Object}
         * @api public
         */
        this.keysPressed = {};


        /**
         * Holds cycleTook
         *
         * @type {Number}
         * @api public
         */
        this.cycleTook = 0;


        /**
         * Holds wining roles
         *
         * @type {Roles}
         * @api public
         */
        this.roles = undefined;


        /**
         * Holds timeout
         *
         * @type {Number}
         * @api public
         */
        this.timeout = undefined;
    }


    /**
     * Initiates all required classes
     *
     * @api public
     */
    Game.prototype.init = function(){
        /*
        this.entities = new window.game.class.List();
        this.mainLoop = new window.game.class.Loop(this, this.opts.cycle || {});
        this.players = new window.game.class.List();
        this.roles = new window.game.class.Roles(this);
        //this.inRouter = new window.game.class.InRouter(this);
        //this.outRouter = new window.game.class.OutRouter(this);
        this.renderer = new window.game.class.Renderer(true);
        var render = {"fn" : "render", "args" : {}, "ref" : this.renderer };
        this.mainLoop.add(render);
        this.mainLoop.references.add({id:'render', ref : render});

        this.loader = new window.game.class.Loader(this, function(){ /*self.start(); });
        this.scoreBoard = new window.game.class.ScoreBoard(this);
        this.scoreBoard.init();
        */
    };


    /**
     * Binds keys
     *
     * @api public
     */
    Game.prototype.bindKey = function(){};


    /**
     * Un-bind keys
     *
     * @api public
     */
    Game.prototype.unBindKey = function(){};


    /**
     * On key down
     *
     * @api public
     */
    Game.prototype.keydown = function(e){
        this.keysPressed[e.which || e.keyCode] = true;
    };


    /**
     * on key up
     *
     * @api public
     */
    Game.prototype.keyup = function(e){
        this.keysPressed[e.which || e.keyCode] = false;
    };


    /**
     * adding entity to entities Collection
     *
     * @api public
     */
    Game.prototype.addEntity = function(entity){
        this.entities.add(entity);
        var entityMove = {"fn" : "move", "args" : {}, "ref" : entity };
        this.mainLoop.add(entityMove);
        this.mainLoop.references.add({id:entity.id, ref : entityMove});
    };


    /**
     * Removing entity from entities Collection
     *
     * @api public
     */
    Game.prototype.removeEntity = function(entity){
        this.entities.remove(entity);
        var item = this.mainLoop.references.get(entity.id);
        this.mainLoop.remove(item);
    };


    /**
     * adding Player to Players List
     *
     * @api public
     */
    Game.prototype.addPlayer = function(player){
        this.players.add(player);
        this.entities.add(player);
        var playerMove = {"fn" : "move", "args" : {}, "ref" : player };
        this.mainLoop.add(playerMove);
        this.mainLoop.references.add({id:player.id, ref : playerMove});
    };


    /**
     * removing Player from Players List
     *
     * @api public
     */
    Game.prototype.removePlayer = function(player){
        this.players.remove(player.id);
        this.entities.remove(player.id);
        var item = this.mainLoop.references.get(player.id);
        this.mainLoop.remove(item);
    };


    /**
     * Loading game
     *
     * @api public
     */
    Game.prototype.load = function(){
        this.loader.load();
    };


    /**
     * Starting game
     *
     * @api public
     */
    Game.prototype.start = function(){
        this.mainLoop.start();
    };


    /**
     * Stopping game
     *
     * @api public
     */
    Game.prototype.stop = function(){
        this.mainLoop.stop();
    };


    /**
     * resetting game
     *
     * @api public
     */
    Game.prototype.reset = function(){};


    /**
     * killing game
     *
     * @api public
     */
    Game.prototype.kill = function(){};

    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.Game = Game;
})();