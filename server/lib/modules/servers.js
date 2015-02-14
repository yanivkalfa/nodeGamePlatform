module.exports = function(_s){
    var _ = _s.oReq.lodash
        , HttpTransit = require(_s.oConfig.pathsList.HttpTransit)(_s)
        ;

    function ServersClass(){
        this.visibleField = ["name","port", "address","user"];
    }

    ServersClass.prototype =  {

        parseAddress : function(address){
            if(!address) return false;
            var serverDetails = address.split(':');
            if(!_.isArray(serverDetails) || serverDetails.length !== 2) return false;

            return {
                address : serverDetails[0] || undefined,
                port: serverDetails[1] || undefined
            }
        },

        login : function(server){
            var options = {
                    "hostname" : server.address,
                    "port" : server.port
                }
                , params = {
                    "method" : 'login',
                    "status" : 0,
                    "success" : false,
                    "data" : {"email" : _s.details.user.email, "password" : _s.details.user.password}
                }
                , self = this
                ;

            options = HttpTransit.prepareRequest(options, false, params);
            return new _s.oReq.Promise(function(resolve, reject) {
                HttpTransit.doRequest(options, params).then(function(resp){
                    try{
                        var response = JSON.parse(resp);
                    }catch(e){
                        return reject(e);
                    }
                    if(response.success){
                        return resolve(response.data);
                    }else{
                        var err = new Error(response.data);
                        return reject(err);
                    }
                }).catch(function(err){
                    return reject(err);
                });
            });
        },

        startGame : function(server, details){

            details.userDetails = {"email" : _s.details.user.email, "password" : _s.details.user.password};

            var options = {
                    "hostname" : server.address,
                    "port" : server.port
                }
                , params = {
                    "method" : 'startGame',
                    "status" : 0,
                    "success" : false,
                    "data" :details
                }
                , self = this
                ;



            options = HttpTransit.prepareRequest(options, false, params);
            return new _s.oReq.Promise(function(resolve, reject) {
                HttpTransit.doRequest(options, params).then(function(resp){
                    try{
                        var response = JSON.parse(resp);
                    }catch(e){
                        return reject(e);
                    }
                    if(response.success){
                        return resolve(response.data);
                    }else{
                        var err = new Error(response.data);
                        return reject(err);
                    }
                }).catch(function(err){
                    return reject(err);
                });
            });
        }
    };


    return new ServersClass();
};