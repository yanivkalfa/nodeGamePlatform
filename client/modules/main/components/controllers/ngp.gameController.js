/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .controller('gameController', [
            '$stateParams',
            '$modal',
            '$scope',
            'Games',
            'Authorization',
            gameController
        ]);

    function gameController(
        $stateParams,
        $modal,
        $scope,
        Games,
        Authorization
        ) {

        function GameController(){
            var gameName, user, game, gameDetails, server, Game, newGame
                , queryString, gameList, gameOptions
                , keyup, keydown, players, pId, p
                ;

            gameList = {
              "pong" : 'PongGame'
            };

            gameName = $stateParams.game;
            user = Authorization.getUser();
            game = Games.get(gameName);
            gameDetails = game.getGameDetails();
            server = gameDetails.serverDetails;
            queryString = [
                '?token=' + user.token,
                '&room=' + gameDetails.room,
                '&game=' + gameDetails.id
            ];

            gameOptions = {
                user : user,
                $modal : $modal,
                $scope : $scope,
                name : gameName,
                serverDetails : 'ws://' + server.address + ':' + server.port + queryString.join(''),
                canvas : {
                    node : '',
                    width : 900,
                    height : 500
                },

                cycle : {
                    cycleEvery : 10
                }
            };

            Game = window.game.class[gameList[gameName]];
            if(!Game) return;
            newGame = new Game(gameOptions);
            newGame.init();

            keyup = function(e){
                newGame.keyup(e);
            };
            keydown = function(e){
                newGame.keydown(e);
            };

            newGame.bindKey = function(){
                document.addEventListener("keyup", keyup);
                document.addEventListener("keydown", keydown);
            };
            newGame.unBindKey = function(){
                document.removeEventListener("keyup", keyup);
                document.removeEventListener("keydown", keydown);
            };
            newGame.bindKey();
            newGame.loadEntities();
        }

        return new GameController();

    }
})();
