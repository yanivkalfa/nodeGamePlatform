(function(){

    /**
     *
     * @param {Game} game ref object
     * @api public
     */
    function PongScoreBoard(game){
        window.game.class.ScoreBoard.apply(this,arguments);

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
    };


    /**
     * load ScoreBoard
     *
     * @overrides
     * @api public
     */
    PongScoreBoard.prototype.load = function(){
        var player, div, span, players, aNode, playerId, aPlayer, head, id;
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

        for(playerId in players ){
            if(players.hasOwnProperty(playerId)){
                aPlayer = players[playerId];

                player = div.cloneNode(true);
                player.id = 'player_' + playerId;
                player.className = 'pong_player';
                if(aPlayer.local) player.className += ' fLeft';
                else player.className += ' fRight';

                aNode = span.cloneNode(true);
                aNode.id = aNode.className = 'player_title';
                aNode.innerText = aPlayer.name + ' Score:';
                aNode.textContent = aPlayer.name + ' Score:';
                player.appendChild(aNode);

                aNode = span.cloneNode(true);
                aNode.id = aNode.className = 'player_score';
                aNode.innerText = 0;
                aNode.textContent = 0;

                id = 'right';
                if(aPlayer.local){
                    id = 'left';
                }
                this.players.add({id:id, player : aPlayer, node : aNode});

                player.appendChild(aNode);
                head.appendChild(player);
            }
        }

        this.game.canvas.node.insertBefore(this.node, this.game.canvas.node.firstChild);

        this.game.loader.loaded(this);
    };

    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.PongScoreBoard = PongScoreBoard;
})();
