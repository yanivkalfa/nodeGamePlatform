(function(){


    /**
     *
     * @extends Game
     * @api public
     */
    function PongGame(opts){
        window.game.class.Game.apply(this, arguments);

        /**
         * Holds snapShots
         *
         * @type {Collection}
         * @api public
         */
        this.snapShots = undefined;

        /**
         * Holds primus - socket
         *
         * @type {Primus}
         * @api public
         */
        this.primus = undefined;


        /**
         * Holds timers
         *
         * @type {Primus}
         * @api public
         */
        this.timers = {};


        /**
         * Holds inRouter
         *
         * @type {InRouter}
         * @api public
         */
        this.inRouter = undefined;


        /**
         * Holds outRouter
         *
         * @type {OutRouter}
         * @api public
         */
        this.outRouter = undefined;
    }

    PongGame.prototype = Object.create(window.game.class.Game.prototype);
    PongGame.prototype.constructor = PongGame;


    /**
     * Initiates all required classes
     *
     * @api public
     */
    PongGame.prototype.init = function(){
        this.entities = new window.game.class.List();
        this.snapShots = new window.game.class.Collection();
        this.mainLoop = new window.game.class.PongLoop(this, this.opts.cycle || {});
        this.players = new window.game.class.List();
        this.roles = new window.game.class.PongRoles(this);
        this.inRouter = new window.game.class.InRouter(this);
        this.outRouter = new window.game.class.OutRouter(this);

        this.loader = new window.game.class.PongLoader(this, function(){ /*self.start();*/ });
        this.scoreBoard = new window.game.class.PongScoreBoard(this);
        this.scoreBoard.init();
    };


    /**
     * On set primus/socket
     *
     * @api public
     */
    PongGame.prototype.setPrimus = function(primus){
        this.primus = primus;
    };


    /**
     * On key down
     *
     * @override
     * @api public
     */
    PongGame.prototype.keydown = function(e){
        var key = e.which || e.keyCode, self=this;
        if(key == 87 || key == 38) self.outRouter.k({k:key,s:1});
        if(key == 83 || key == 40) self.outRouter.k({k:key,s:1});
    };


    /**
     * on key up
     *
     * @override
     * @api public
     */
    PongGame.prototype.keyup = function(e){
        var key = e.which || e.keyCode, self = this;
        if(key == 87 || key == 38) self.outRouter.k({k:key,s:0});
        if(key == 83 || key == 40) self.outRouter.k({k:key,s:0});
    };


    /**
     * adding entity to entities Collection
     *
     * @override
     * @api public
     */
    PongGame.prototype.addEntity = function(entity){
        this.entities.add(entity);
    };


    /**
     * Removing entity from entities Collection
     *
     * @override
     * @api public
     */
    PongGame.prototype.removeEntity = function(entity){
        this.entities.remove(entity.id);
    };


    /**
     * adding Player to Players List
     *
     * @override
     * @api public
     */
    PongGame.prototype.addPlayer = function(player){
        this.players.add(player);
        this.entities.add(player);
    };


    /**
     * removing Player from Players List
     *
     * @override
     * @api public
     */
    PongGame.prototype.removePlayer = function(player){
        this.players.remove(player.id);
        this.entities.add(player.id);
    };

    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.PongGame = PongGame;
})();