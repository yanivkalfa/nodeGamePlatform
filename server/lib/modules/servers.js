module.exports = function(_s){
    var _ = _s.oReq.lodash;
    function ServersClass(){}

    ServersClass.prototype =  {

        analys : function(arg){
            var self = this;
            if(!arg[0]) return false;
            if(typeof arg[0] !== 'function') return false;
            return self[arg[0]](arg.splice(0,1))
        },

        fetchByName : function(name){
            return new _s.oReq.Promise(function(resolve, reject) {
                Servers.findOne({name : name}).exec(function (err, server) {

                    console.log('after findOne', err, server);
                    if(err) return reject(err);
                    return resolve(server);
                });
            });
        },

        addServer : function(args){
            console.log(args);
            if(!_.isArray(args)) return false;

            return true;
        }
    };


    return ServersClass;
};