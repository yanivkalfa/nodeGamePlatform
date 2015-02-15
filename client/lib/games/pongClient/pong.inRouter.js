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
        var self = this, gs, ss;

        ss = function(ss){
            self.game.snapShots.add(ss);
            if(self.game.snapShots.get().length >200)self.game.snapShots.get().shift();
        };

        gs = function(msg){
            if(msg.gs) {
                console.log(msg.t);
                console.log(Date.now());
                console.log(Date.now() - msg.t);

                self.game.countDown = msg.gs;
                self.game.startCountDown();

                self.game.primus.off('data', gs);
                self.game.primus.on('data', ss);
            }
        };

        self.game.primus.on('data', gs);
    };


    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.PongInRouter = PongInRouter;
})();