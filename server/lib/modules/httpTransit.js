

module.exports = function(_s){

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
                _s.oModules.uf.concat(_s, res).then(function(fullResponse){
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

    return new HttpTransit();
};