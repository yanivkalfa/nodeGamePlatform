module.exports = function(_s){
    var _ = _s.oReq.lodash;
    function ServersClass(){
        this.visibleField = ["name","playerCount", "queueName"];
    }

    ServersClass.prototype =  {

        filter : function(games){
            var self = this;
            if(_.isEmpty(games)) return false;
            games = _.isArray(games) ? games : [games];

            _(games).forEach(function(game, i){
                console.log('game, i', game, i);
                games[i] = _.pick(games, self.visibleField);
            });

            return games;
        },


        fetch : function(query){
            var self = this;
            return new _s.oReq.Promise(function(resolve, reject) {
                Games.find(query).exec(function (err, succ) {
                    if(err) return reject(err);
                    return resolve(self.filter(succ));
                });
            });
        },

        fetchByName : function(name){
            var self = this;
            return new _s.oReq.Promise(function(resolve, reject) {
                Games.findOne({name : name}).exec(function (err, succ) {
                    if(err) return reject(err);
                    return resolve(self.filter(succ));
                });
            });
        },

        add : function(game){
            var self = this;
            return new _s.oReq.Promise(function(resolve, reject) {
                if('object' !== typeof game|| _.isEmpty(game)) return reject('Please supply correct game details');

                var success = function(game){ return resolve(self.filter(game)); };
                var fail = function(err){ return reject(err); };
                Games.create(game).then(success,fail);
            });
        },

        remove : function(game){
            var self = this;
            return new _s.oReq.Promise(function(resolve, reject) {
                if(_.isEmpty(game)) return reject('We could not remove this game');
                Games.remove({ name: game }, function (err) {
                    if (err) return reject(err);
                    return resolve(true);
                });
            });
        }
    };


    return new ServersClass();
};