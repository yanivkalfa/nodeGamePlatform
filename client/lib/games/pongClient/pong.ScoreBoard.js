(function(){

    /**
     *
     * @param {Game} game ref object
     * @api public
     */
    function PongScoreBoard(game){
        window.game.class.ScoreBoard.apply(this,arguments);


        /**
         * winner is
         *
         * @type {String}
         * @api public
         */
        this.winnerIs = undefined;


        /**
         * winner node
         *
         * @type {Node}
         * @api public
         */
        this.winnerIsNode = undefined;

    }

    PongScoreBoard.prototype = Object.create(window.game.class.ScoreBoard.prototype);
    PongScoreBoard.prototype.constructor = PongScoreBoard;


    /**
     * Init ScoarBoard
     *
     * @override
     * @api public
     */
    PongScoreBoard.prototype.init = function(){
        this.game.loader.add(this);
    };

    /**
     * Renders ScoreBoard
     *
     * @overrides
     * @api public
     */
    PongScoreBoard.prototype.render = function(){
        var players
            , leftPlayer
            , rightPlayer
            ;

        players = this.players.get();
        leftPlayer = players['left'];
        rightPlayer = players['right'];
        if(leftPlayer) {
            leftPlayer.node.innerText = leftPlayer.player.attributes.score;
            leftPlayer.node.textContent = leftPlayer.player.attributes.score;
        }
        if(rightPlayer) {
            rightPlayer.node.innerText = rightPlayer.player.attributes.score;
            rightPlayer.node.textContent = rightPlayer.player.attributes.score;
        }

        this.winnerIsNode.innerText = this.winnerIs;
        this.winnerIsNode.textContent = this.winnerIs;

    };


    /**
     * load ScoreBoard
     *
     * @overrides
     * @api public
     */
    PongScoreBoard.prototype.load = function(){
        var player, div, span, players, aNode, playerId, aPlayer, head, id, lPlayer, rPlayer, winnerIs;
        players = this.game.players.get();
        div = document.createElement("div");
        span = document.createElement("span");

        this.node = div.cloneNode(true);
        aNode = div.cloneNode(true);
        aNode.id = aNode.className = 'headerBackGround';
        this.node.appendChild(aNode);

        head = div.cloneNode(true);
        head.id = head.className = 'header';
        this.node.appendChild(head);


        lPlayer = div.cloneNode(true);
        lPlayer.id = lPlayer.className = 'sb-player fLeft';

        rPlayer = div.cloneNode(true);
        rPlayer.id = rPlayer.className = 'sb-player fLeft';

        this.winnerIsNode = div.cloneNode(true);
        this.winnerIsNode.id = this.winnerIsNode.className = 'sb-winnerIs fLeft';


        head.appendChild(lPlayer);
        head.appendChild(this.winnerIsNode);
        head.appendChild(rPlayer);

        for(playerId in players ){
            if(players.hasOwnProperty(playerId)){
                aPlayer = players[playerId];

                player = div.cloneNode(true);
                player.id = 'player_' + playerId;
                player.className = 'pong_player';

                aNode = span.cloneNode(true);
                aNode.id = aNode.className = 'player_title';
                aNode.innerText = aPlayer.name + ' Score:';
                aNode.textContent = aPlayer.name + ' Score:';
                player.appendChild(aNode);

                aNode = span.cloneNode(true);
                aNode.id = aNode.className = 'player_score';
                aNode.innerText = 0;
                aNode.textContent = 0;
                player.appendChild(aNode);

                if(aPlayer.local){
                    id = 'left';
                    lPlayer.appendChild(player);
                }else{
                    id = 'right';
                    rPlayer.appendChild(player);
                }

                this.players.add({id:id, player : aPlayer, node : aNode});
            }
        }

        this.game.canvas.node.insertBefore(this.node, this.game.canvas.node.firstChild);

        this.game.loader.loaded(this);
    };

    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.PongScoreBoard = PongScoreBoard;
})();
