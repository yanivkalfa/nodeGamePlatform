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
            var deferred = $q.defer(),
                self = this;

            var id
                , username
                , credentials = {}
                , success
                , fail
                ;

            id = user.id || undefined;
            username = user.username || user || undefined;

            if(!id && !username) return false

            if(id){ credentials = {"id" : id }; }
            if(username){ credentials = {"username" : username }; }



            fail = function(err){
                if(err) {
                    this._user = undefined;
                    return deferred.reject(err);
                }
            };

            success = function(user){
                if(user){
                    this._user = user;
                    return deferred.resolve(user);
                }
            };

            this.fetchUser(credentials).then(success).catch(fail);

            return deferred.promise;
        },

        fetchUser : function(credentials){

            var deferred = $q.defer(),
                self = this;

            this.api.setMethod('post').setParams({
                "method" : 'fetchUser',
                "status" : 0,
                "success" : false,
                "data" : credentials
            });

            this.api.doRequest().then(function(resp){
                if(resp.payload.success){
                    deferred.resolve(resp.payload.data);
                }else{
                    deferred.reject(resp.payload.data);
                }
            });

            return deferred.promise;
        },


        get: function() { return this._user; },

    };

    return new UserFactory();
}