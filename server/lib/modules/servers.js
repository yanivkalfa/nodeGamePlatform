module.exports = function(_s){
    var _ = _s.oReq.lodash;
    function Servers(){}

    Servers.prototype =  {

        analys : function(arg){
            var self = this;
            if(!arg[0]) return false;
            return self[arg[0]](arg.splice(0,1))
        },

        fetchByName : function(name){
            return new _s.oReq.Promise(function(resolve, reject) {
                Servers.findOne({name : name}).exec(function (err, user) {
                    if(err) return reject(err);
                    return resolve(user);
                });
            });
        },

        addServer : function(args){
            console.log(args);
            if(!_.isArray(args)) return false;
        }
    };


    return Servers;
};