/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .service('Games', [
            'Api',
            'List',
            Games
        ]);

    function Games(Api, List) {

        var api = Api.createNewApi(ngp.const.app.ajaxUrl);

        function GamesService(){
            this.games = new List();
        }

        GamesService.prototype =  {

            init : function(){
                var deferred = $q.defer();

                var success,fail, options;

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
                    console.log(err);
                    api.doRequest(options).then(success).catch(fail);
                };
                api.doRequest(options).then(success).catch(fail);

                return deferred.promise;
            },

            setGames : function(games){
                var self = this;
                if(!_.isArray(games) || _.isEmpty(games)) return false;

                _(games).forEach(function(game){
                    self.games.add(game);
                });

                return true;
            }



        };

        return new GamesService();
    }
})();