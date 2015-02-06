module.exports = function(_s){
    var _ = _s.oReq.lodash;
    function GamesApi(){
        this.visibleField = ['_id',"name","playerCount", "queueName"];
    }

    GamesApi.prototype =  {

        filter : function(games){
            var self = this, isArray = _.isArray(games);

            if(_.isEmpty(games)) return false;
            games = isArray ? games : [games];
            _(games).forEach(function(game, i){
                games[i] = _.pick(game, self.visibleField);
            });


            return isArray ? games : games[0];
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

        fetchByQueueName : function(qName){
            var self = this;
            return new _s.oReq.Promise(function(resolve, reject) {
                Games.findOne({queueName : qName}).exec(function (err, succ) {
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


    return new GamesApi();
};