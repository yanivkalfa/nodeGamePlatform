/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('User', [
        '$q',
        'Api',
        User
    ]);

function User(
    $q,
    Api
    ) {

    function UserFactory(){
        this.api = Api.createNewApi(ngp.const.app.ajaxUrl);
        this._user = undefined;
    }

    UserFactory.prototype =  {

        init : function(user){
            if(typeof user !== 'object' || !user.id || !user.username) return false;

            this._user = user;

            return true;
        },

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

            if(id){ credentials = {"id" : id }; }
            if(username){ credentials = {"username" : username }; }


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
        },


        get: function() { return this._user; }

    };

    return new UserFactory();
}