/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

angular.module(ngp.const.app.name)
    .factory('apiFactory', [
        '$http',
        '$q',
        '$state',
        '$location',
        apiFactory
    ]);

function apiFactory($http, $q) {

    var _method, _url, _params = false, _options = false;

    return {
        setOptions : function(options){ _options = options; },
        setMethod : function(method){ _method = method; },
        setURL : function(url){ _url = url; },
        setParams : function(params){ _params = params; },
        getMethod : function(){ return _method; },
        getOptions : function(){ return _options; },
        getURL : function(){ return _url; },
        getParams : function(){ return _params; },
        doRequest : function(succ,err){
            var deferred = $q.defer();

            succ = succ || function(data, status, headers, config) {
                deferred.resolve(data, status, headers, config);
            };
            err = err || function(data, status, headers, config) {
                deferred.reject(data, status, headers, config);
            };

            if(_options)
            {
                $http(_options).success(succ).error(err);
            }
            else if(_method && _url)
            {
                $http[_method](_url, _params).success(succ).error(err);
            }

            return deferred.promise;
        }
    };
}