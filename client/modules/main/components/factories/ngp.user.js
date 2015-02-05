/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .factory('User', [function(){return ngp.oFns.User;}]);


/*
fetchUser : function(user){

    var deferred = $q.defer(),
        self = this
        , id
        , username
        , credentials = {}
        , success
        , fail
        ;

    id = user.id || undefined;
    username = user.username || user || undefined;

    if(!id && !username) return false;

    credentials = id ? {"id" : id } : {"username" : username };


    fail = function(err){
        this._user = undefined;
        return deferred.reject(err);
    };

    success = function(user){
        this._user = user;
        return deferred.resolve(user);
    };


    this.api.setMethod('post').setParams({
        "method" : 'fetchUser',
        "status" : 0,
        "success" : false,
        "data" : credentials
    });

    this.api.doRequest().then(function(resp){
        if(resp.payload.success) success(resp.payload.data);
        else fail(resp.payload.data);
    });

    return deferred.promise;
}*/