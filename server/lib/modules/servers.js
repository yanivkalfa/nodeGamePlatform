module.exports = function(_s){
    var _ = _s.oReq.lodash;
    function ServersClass(){}

    ServersClass.prototype =  {

        analys : function(arg){
            var self = this;
            if(!arg[0]) return false;
            if(typeof self[arg[0]] !== 'function') return false;

            var filterArg = function(item, i){
                return i !== 0;
            };

            return self[arg[0]](arg.filter(filterArg))
        },

        fetchByName : function(name){
            return new _s.oReq.Promise(function(resolve, reject) {
                Servers.findOne({name : name}).exec(function (err, server) {
                    if(err) return reject(err);
                    return resolve(server);
                });
            });
        },

        add : function(args){

            if(!_.isArray(args)) return false;
            var user = args[0];
            console.log('user', user);
            return
            try{
                user = JSON.parse(args[0]);
            }catch(e){
                user = false;
            }
            console.log('user' , user);

            return true;
        }
    };


    return ServersClass;
};