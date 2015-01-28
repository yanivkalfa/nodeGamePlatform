module.exports = function(_s){
    return {

        concat : function (res) {
            return new _s.oReq.Promise(function(resolve, reject) {
                res.pipe(_s.oReq.concat(function(fullResp) {
                    var statusCode = parseInt(res.statusCode);
                    if(statusCode < 200 || statusCode > 299){
                        return reject(new Error('{"error" : "There is some problem with the request status code: '+statusCode+'"}'));
                    }else{
                        return resolve(fullResp.toString());
                    }
                }));
            });
        },

        extend : function(source,extend){
            for(var key in extend){
                source.prototype[key] = extend[key];
            }
        }

    };
};

