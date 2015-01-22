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
            var deferred = $q.defer(), self = this;
            if (force === true) this._user = undefined;

            this._user = $cookieStore.get("user");

            if (this.isSet())
            {
                this._authenticate()
                    .then(function(user){
                        self.setAuthenticated();
                        deferred.resolve(self._user);
                    },function(err){
                        self.setNotAuthenticated();
                        deferred.reject(err);
                    });

            }
            else
            {
                deferred.reject('No user Found');
            }

            return deferred.promise;

        },

        _authenticate: function() {
            var deferred = $q.defer(),
                self = this;

            if(!this.isSet()) {
                deferred.reject('No user found');
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

        authenticate: function() {
            if(!this.isSet()) return false;
            var self = this;

            return this._authenticate()
                .then(function(user){
                    this.setAuthenticated();
                },function(err){
                    self.setNotAuthenticated();
                    $state.go('login');
                });
        },

        setAuthenticated : function(){
            this._authenticated = true;
        },

        setNotAuthenticated : function(){
            this._authenticated = false;
            $cookieStore.remove("user");
        },

        isSet: function() {
            return this._user && angular.isDefined(this._user.token)
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