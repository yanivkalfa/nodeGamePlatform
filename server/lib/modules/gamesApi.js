module.exports = function(_s){
    var _ = _s.oReq.lodash;
    function ServersClass(){
        this.visibleField = ["name","playerCount", "queueName"];
    }

    ServersClass.prototype =  {


        fetchAll : function(){
            return new _s.oReq.Promise(function(resolve, reject) {
                Games.find().exec(function (err, succ) {
                    if(err) return reject(err);
                    return resolve(succ);
                });
            });
        },

        fetchByName : function(name){
            return new _s.oReq.Promise(function(resolve, reject) {
                Games.findOne({name : name}).exec(function (err, succ) {
                    if(err) return reject(err);
                    return resolve(succ);
                });
            });
        },

        add : function(game){
            return new _s.oReq.Promise(function(resolve, reject) {
                if('object' !== typeof game|| _.isEmpty(game)) return reject('Please supply correct game details');

                var success = function(game){ return resolve(game); };
                var fail = function(err){ return reject(err); };
                Games.create(game).then(success,fail);
            });
        },

        remove : function(game){
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