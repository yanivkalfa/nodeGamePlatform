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
            console.log(arg);
            var self = this
                , success
                , fail
                , filter
                ;

            return new _s.oReq.Promise(function(resolve, reject) {
                if(!arg[0]) return reject('!arg[0]');
                if(typeof self[arg[0]] !== 'function') return reject('!function');

                filter = function(item, i){ return i !== 0; };
                success = function(success){  return resolve(success); };
                fail = function(err){ return reject(err); };
                self[arg[0]](arg.filter(filter)).then(success,fail).catch(fail)
            });
        },

        fetchByName : function(name){
            return new _s.oReq.Promise(function(resolve, reject) {
                Servers.find().exec(function (err, server) {
                    if(err) return reject(err);
                    return resolve(server);
                });
            });
        },

        add : function(args){
            return new _s.oReq.Promise(function(resolve, reject) {
                if(!_.isArray(args) || !args[0] || _.isEmpty(args[0])) return reject(0);
                var server = {}
                    , success
                    , fail
                    ;
                try{
                    server = JSON.parse(args[0]);
                }catch(e){
                    console.log(e);
                    server = false;
                }

                if(!server) return reject(0);
                server = this.filter(server);
                success = function(server){
                    console.log('success arguments',arguments);
                    console.log('success server',server);
                    return resolve(1);
                };
                fail = function(err){
                    console.log('fail arguments',arguments);
                    console.log('fail err',err);
                    return reject(0);
                };

                console.log('before create', server);
                Servers.create(server).then(success,fail).catch(fail);
            });
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