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

    function ApiFunction(url, method, params, options){
        this._url = url || false;
        this._method = method || false;
        this._params = params || false;
        this._options = options || false;
    }

    ApiFunction.prototype = {
        setOptions : function(options){ this._options = options; return this; },
        setURL : function(url){ this._url = url; return this; },
        setMethod : function(method){ this._method = method; return this; },
        setParams : function(params){ this._params = params; return this; },
        getOptions : function(){ return this._options; },
        getURL : function(){ return this._url; },
        getMethod : function(){ return this._method; },
        getParams : function(){ return this._params; },
        doRequest : function(succ,err){
            var deferred = $q.defer();

            succ = succ || function(data, status, headers, config) {
                deferred.resolve({
                    data : data,
                    status : status,
                    headers : headers,
                    config : config
                });
            };
            err = err || function(data, status, headers, config) {
                deferred.reject({
                    data : data,
                    status : status,
                    headers : headers,
                    config : config
                });
            };

            if(this._options)
            {
                $http(this._options).success(succ).error(err);
            }
            else if(this._url && this._method)
            {
                $http[this._method](this._url, this._params).success(succ).error(err);
            }

            return deferred.promise;
        }
    };

    return { createNewApi : function(url, method, params, options){ return new ApiFunction(url, method, params, options); } }
}