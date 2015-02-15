(function(){

    /**
     *
     * @param {Game} game
     *
     * @extend OutRouter
     * @api public
     */
    function PongOutRouter(game){
        window.game.class.OutRouter.apply(this,arguments);
    }

    PongOutRouter.prototype = Object.create(window.game.class.OutRouter.prototype);
    PongOutRouter.prototype.constructor = PongOutRouter;


    /**
     * We send key strokes
     *
     * @api public
     */
    PongOutRouter.prototype.pr = function(){
        this.game.primus.write({"m":'pr', "d": 'playerReady'});
    };


    /**
     * We send key strokes
     *
     * @param {Object} k
     * @api public
     */
    PongOutRouter.prototype.ks = function(k){
        this.game.primus.write({"m":'ks', "d": k});
    };

    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};

    window.game.class.PongOutRouter = PongOutRouter;
})();