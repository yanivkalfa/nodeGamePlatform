

module.exports = function(_s, _rf){

    var _ = _s.oReq.lodash
        , http = require('http')
        ;

    function HttpTransit (){ }

    HttpTransit.prototype.prepareRequest = function(options,cusHeader,params)
    {
        var defaults =
        {
            "hostname" : 'localhost',
            "port" : 8001,
            "path" : '/ajaxHandler',
            "method": 'post',
            "headers" : {}
        };

        if(typeof params !== 'undefined' && params != '')
        {
            defaults.headers['Content-Type'] = 'application/json';
            defaults.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(params));
        }

        if(typeof cusHeader !== 'undefined' && cusHeader.length > 0)
        {
            cusHeader.forEach(function(header){
                defaults.headers[header.key] = header.value;
            });
        }
        return _.defaults(options, defaults);
    };

    HttpTransit.prototype.doRequest = function(options, params){
        return new _s.oReq.Promise(function(resolve, reject) {
            var req;
            req = http.request(options, function(res) {
                _s.oModules.uf.concat(res).then(function(fullResponse){
                    return resolve(fullResponse);
                }).catch(function(err){
                    return reject(err);
                })
            });

            req.setTimeout(4500, function(){
                req.abort();
            });

            if(typeof params !== 'undefined' && params != ''){
                req.write( JSON.stringify(params) );
            }
            req.on('error', function(err) {
                return reject(err);
            });

            req.end();
        });

    };

    HttpTransit.prototype.login = function(server){
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

        options = this.prepareRequest(options, false, params);
        return new _s.oReq.Promise(function(resolve, reject) {
            self.doRequest(options, params).then(function(resp){
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


    };






    return new HttpTransit();
};