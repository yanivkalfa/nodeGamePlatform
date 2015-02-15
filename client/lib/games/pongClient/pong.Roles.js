(function(){

    /**
     *
     * @param {Game} game
     * @extends Roles
     * @api public
     */
    function PongRoles(game){
        window.game.class.Roles.apply(this,arguments);
    }

    PongRoles.prototype = Object.create(window.game.class.Roles.prototype);
    PongRoles.prototype.constructor = PongRoles;

    /**
     * go through Rules and invoke rule functions
     *
     * @api public
     */
    PongRoles.prototype.check = function(){
        var toReturn = false, lPlayer, rPlayer, winner, winnerName, self = this;

        lPlayer = this.game.scoreBoard.players.list.left.player;
        rPlayer = this.game.scoreBoard.players.list.right.player;

        if(lPlayer.attributes.score >= 10 || rPlayer.attributes.score >= 10){

            if(lPlayer.attributes.score >= 10){
                winner =  'left';
                winnerName = lPlayer.name;
            } else {
                winner = 'right';
                winnerName =  rPlayer.name;
            }

            if(this.game.mySide == winner){
                this.game.scoreBoard.winnerIs = 'Winner is: ' + winnerName;
            }else{
                this.game.scoreBoard.winnerIs = 'Winner is: ' + winnerName;
            }
            this.game.scoreBoard.render();

            clearTimeout(self.game.timeout);
            self.game.timeout = setTimeout(function(){
                self.game.kill();
                clearTimeout(self.game.timeout);
            },300);

            toReturn = true;
        }

        return toReturn;
    };


    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.PongRoles = PongRoles;
})();