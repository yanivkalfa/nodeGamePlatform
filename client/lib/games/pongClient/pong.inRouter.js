(function(){

    /**
     *
     * @param {Game} game
     *
     * @extend InRouter
     * @api public
     */
    function PongInRouter(game){
        window.game.class.InRouter.apply(this,arguments);
    }

    PongInRouter.prototype = Object.create(window.game.class.InRouter.prototype);
    PongInRouter.prototype.constructor = PongInRouter;

    /**
     * Init inRouter
     *
     * @api public
     */
    PongInRouter.prototype.init = function(){
        var self = this;
        this.game.primus.on('data', this.rout.bind(this));
    };


    /**
     * kill inRouter
     *
     * @api public
     */
    PongInRouter.prototype.kill = function(){
        var self = this;
        this.game.primus.off('data', this.rout.bind(this));
    };


    /**
     * Init inRouter
     *
     * @api public
     */
    PongInRouter.prototype.rout = function(msg){
        this[msg.m](msg.d);
    };


    PongInRouter.prototype.os = function(os){
        this.game.mainLoop.offset = Date.now() - os;
    };


    PongInRouter.prototype.pr = function(players){

        for(var pId in players){
            if(!players.hasOwnProperty(pId)) continue;
            this.game.joinPlayer(players[pId]);
        }

        this.game.load();
    };


    PongInRouter.prototype.gs = function(msg){
        this.game.countDown = msg;
        this.game.startCountDown();
    };


    PongInRouter.prototype.ss = function(ss){
        this.game.snapShots.add(ss);
        if(this.game.snapShots.get().length >200)this.game.snapShots.get().shift();
    };


    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.PongInRouter = PongInRouter;
})();