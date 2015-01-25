/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .service('Authorization', [
        '$q',
        '$cookieStore',
        '$rootScope',
        '$state',
        'Api',
        'WebSocket',
        'Latency',
        Authorization
    ]);

function Authorization(
    $q,
    $cookieStore,
    $rootScope,
    $state,
    Api,
    WebSocket,
    Latency
    ) {

    function AuthorizationService(){
        this._user = undefined;
        this._dependencies = [{cName : WebSocket, 'async' :true }, {cName : Latency, 'async' :false }];
        this._authenticated = false;
        this.api = Api.createNewApi();
    }

    AuthorizationService.prototype =  {
        getUser: function() {
            return this._user;
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
                        self.initDependencies().then(function(deps){
                            deferred.resolve(self._user);
                        }).catch(function(err){
                            self.setNotAuthenticated();
                            deferred.reject(err);
                        });
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

        logout : function(){
            this.setNotAuthenticated();
            this.killDependencies();
            $state.go('login');
        },

        initDependencies : function(){
            var deferred = $q.defer(), self = this;
            var depProArray = [];
            _(this._dependencies).forEach(function(dep){
                var depInit = dep.cName.init(self._user);
                if(dep.async) depProArray.push(depInit);
            });

            if(depProArray.length > 0){
                $q.all(depProArray).then(deferred.resolve).catch(deferred.reject);
            }else{
                deferred.resolve(true);
            }

            return deferred.promise;
        },

        killDependencies : function(){
            var self = this;
            _(this._dependencies).forEach(function(dep){
                dep.cName.destroy(self._user);
            });
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
                    self.setAuthenticated();
                },function(err){
                    self.setNotAuthenticated();
                    $state.go('login');
                });
        },

        authorized : function(user){
            var isAuthenticated = this.isAuthenticated();

            if ($rootScope.ngp.toState.data.roles && $rootScope.ngp.toState.data.roles.length > 0 && !this.isInAnyRole($rootScope.ngp.toState.data.roles)) {
                if (isAuthenticated) return $state.go('accessdenied');
                else { return this.notAuthorized();}
            }

            return user;
        },

        notAuthorized : function(err){
            $rootScope.ngp.returnToState = $rootScope.ngp.toState;
            $rootScope.ngp.returnToStateParams = $rootScope.ngp.toStateParams;

            return $state.go('login');
        },

        setAuthenticated : function(){
            this._authenticated = true;
        },

        setNotAuthenticated : function(){
            this._user = undefined;
            this._authenticated = false;
            $cookieStore.remove('user');
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

    return new AuthorizationService();
}