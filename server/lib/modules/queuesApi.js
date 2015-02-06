module.exports = function(_s){
    var _ = _s.oReq.lodash;
    function QueuesApi(){
        this.visibleField = ["out_id","name","room","start","end","game","user"];
    }

    QueuesApi.prototype =  {

        filter : function(queues){
            var self = this;
            if(_.isEmpty(queues)) return false;
            queues = _.isArray(queues) ? queues : [queues];
            _(queues).forEach(function(queue, i){
                queues[i] = _.pick(queue, self.visibleField);
            });
            return queues;
        },


        fetch : function(query){
            var self = this;
            return new _s.oReq.Promise(function(resolve, reject) {
                Queues.find(query).populate('game user').exec(function (err, succ) {
                    if(err) return reject(err);
                    return resolve(self.filter(succ));
                });
            });
        },

        fetchSortLimit : function(query, fName, limit){
            var self = this;
            return new _s.oReq.Promise(function(resolve, reject) {
                Queues.find(query).populate('game user').sort('-'+fName).limit(limit).exec(function (err, succ) {
                    if(err) return reject(err);
                    return resolve(self.filter(succ));
                });
            });
        },

        add : function(queue){
            var self = this;
            return new _s.oReq.Promise(function(resolve, reject) {
                if('object' !== typeof queue|| _.isEmpty(queue)) return reject('Please supply correct queue details');

                var success = function(queue){ return resolve(self.filter(queue)); };
                var fail = function(err){ return reject(err); };
                Queues.create(queue).then(success,fail);
            });
        },

        remove : function(queue){
            var self = this;
            return new _s.oReq.Promise(function(resolve, reject) {
                if(_.isEmpty(queue)) return reject('We could not remove this queue');
                Queues.remove(queue, function (err) {
                    if (err) return reject(err);
                    return resolve(true);
                });
            });
        }
    };


    return new QueuesApi();
};