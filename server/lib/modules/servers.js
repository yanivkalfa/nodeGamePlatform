module.exports = function(_s){
    var _ = _s.oReq.lodash;
    function ServersClass(){
        this.visibleField = ["name","port", "address","user"];
    }

    ServersClass.prototype =  {

        filter : function(server){
            var self = this;
            return _.pick(server, self.visibleField);
        },

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

            if(!_.isArray(args) || !args[0] || _.isEmpty(args[0])) return false;
            var server = {}
                , success
                ;
            try{
                server = JSON.parse(args[0]);
            }catch(e){
                console.log(e);
                server = false;
            }
            if(!server) return false;

            success = function(server){ return true; };
            Servers.create(server).then(success,console.log);
        },

        remove : function(args){
            if(!_.isArray(args) || !args[0] || _.isEmpty(args[0])) return false;
            var server = args[0]
                , success
                ;
            if(!server) return false;
            Servers.remove({ name: server }, function (err) {
                if (err) return console.log(err);
                return true;
            });
        }
    };


    return ServersClass;
};