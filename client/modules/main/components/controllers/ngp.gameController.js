/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .controller('gameController', [
            '$stateParams',
            'Games',
            'Authorization',
            gameController
        ]);

    function gameController(
        $stateParams,
        Games,
        Authorization
        ) {

        function GameController(){
            var gameName, user, game, gameDetails, server, queryString, primus, wsAddress;

            gameName = $stateParams.game;
            user = Authorization.getUser();
            game = Games.get(gameName);
            gameDetails = game.getGameDetails();
            server = gameDetails.serverDetails;
            console.log(server);
            queryString = [
                '?token=' + user.token,
                '&room=' + gameDetails.room,
                '&game=' + gameDetails.name
            ];

            wsAddress = 'ws://' + server.address + ':' + server.port + queryString.join('');

            console.log(wsAddress);

            primus = Primus.connect(wsAddress);
            primus.on('data', function(msg){});
            primus.on('open', function open() {});
            primus.on('error', function error(err) {});
            primus.on('end', function end() {});

        }

        return new GameController();

    }
})();
