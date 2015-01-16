/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('User', [
        '$q',
        '$cookieStore',
        '$state',
        'Api',
        userService
    ]);

function userService(
    $q,
    $cookieStore,
    $state,
    Api
    ) {

    function UserService(){
        this._user = undefined;
        this._authenticated = false;
        this.api = Api.createNewApi();
    }

    UserService.prototype =  {
        get: function() {
            return this._user;
        },

        getRoles: function() {
            return this._user.roles;
        },

        set: function(user) {
            this._user = user;
        },

        init: function(force) {
            var deferred = $q.defer();
            if (force === true) this._user = undefined;

            if (angular.isDefined(this._user))
            {
                deferred.resolve(this._user);
                return deferred.promise;
            }

            if(this.authenticate())
            {
                deferred.resolve(this._user);
            }
            else
            {
                deferred.reject(false);
            }


            return deferred.promise;
        },

        authenticate: function(user) {
            this._user = user || $cookieStore.get("user");
            this._authenticated = angular.isDefined(this._user);

            if (!angular.isDefined(this._user))
            {
                $cookieStore.remove("user");
                return false;
            }
            else
            {
                console.log('true');
                return true;
            }
        },

        _authenticateUser: function() {
            var deferred = $q.defer(),
                self = this;

            if(!this.authenticate()) {
                deferred.reject('No user to authenticate login');
                return deferred.promise;
            }

            var options = {
                method: 'post',
                url: ngp.const.app.ajaxUrl,
                data: {
                    "method" : 'authenticateUser',
                    "status" : 0,
                    "success" : false,
                    "data" : self._user
                }
            };

            this.api.doRequest(options).then(function(resp){
                if(resp.payload.success){
                    deferred.resolve(resp.payload.data);
                }else{
                    deferred.reject(resp.payload.data);
                }
            });

            return deferred.promise;
        },

        authenticateUser: function() {
            if(!this.authenticate()) return false;

            return this._authenticateUser()
                .then(function(user){

                },function(err){
                    $cookieStore.remove("user");
                    $state.go('login');
                });
        },

        isResolved: function() {
            return angular.isDefined(this._user);
        },
        isAuthenticated: function() {
            return this._authenticated;
        },
        isInRole: function(role) {
            if (!this._authenticated || !this._user.roles) return false;

            return this._user.roles.indexOf(role) != -1;
        },
        isInAnyRole: function(roles) {
            if (!this._authenticated || !this._user.roles) return false;

            for (var i = 0; i < roles.length; i++) {
                if (this.isInRole(roles[i])) return true;
            }

            return false;
        }
    };

    return new UserService();
}