/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .service('Games', [
            '$q',
            'Api',
            'List',
            'Game',
            'Notify',
            Games
        ]);

    function Games(
        $q,
        Api,
        List,
        Game,
        Notify
        ) {

        var api = Api.createNewApi(ngp.const.app.ajaxUrl);

        function GamesService(){
            List.apply(this,arguments);
        }

        GamesService.prototype = Object.create(List.prototype);
        GamesService.prototype.constructor = GamesService;

        GamesService.prototype.init = function(){
            var deferred = $q.defer(),success,fail, options;

            options = {
                method: 'post',
                url: ngp.const.app.ajaxUrl,
                data: {
                    "method" : 'getGames',
                    "status" : 0,
                    "success" : false,
                    "data" : ''
                }
            };

            success = function(resp){
                if(resp.payload.success){
                    deferred.resolve(resp.payload.data);
                }else{
                    deferred.reject(resp.payload.data);
                }
            };

            fail = function(err){
                Notify.error(err);
            };
            api.doRequest(options).then(success).catch(fail);

            return deferred.promise;
        };

        GamesService.prototype.setGames = function(games){
            var self = this, game;
            if(!_.isArray(games) || _.isEmpty(games)) return false;

            _(games).forEach(function(g){
                game = new Game(g.id, g.name, g.queueName, g.userCount);
                self.add(game, game.name);
            });

            return true;
        };

        return new GamesService();
    }
})();