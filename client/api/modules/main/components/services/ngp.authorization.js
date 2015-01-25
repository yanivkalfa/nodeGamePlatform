/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .factory('Authorization', [
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

    var _user = undefined
        , _dependencies = [{cName : WebSocket, 'async' :true }, {cName : Latency, 'async' :false }]
        , _authenticated = false
        , _api = Api.createNewApi();

    return  {
        getUser: function() {
            return _user;
        },

        init: function(force) {
            var deferred = $q.defer(), self = this;
            if (force === true) _user = undefined;

            _user = $cookieStore.get("user");
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
            _(_dependencies).forEach(function(dep){
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
            _(_dependencies).forEach(function(dep){
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

            _api.doRequest(options).then(function(resp){
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
                if (isAuthenticated) {
                    $state.go('accessdenied');
                    return false;
                }
                else { return this.notAuthorized();}
            }

            return true;
        },

        notAuthorized : function(err){
            $rootScope.ngp.returnToState = $rootScope.ngp.toState;
            $rootScope.ngp.returnToStateParams = $rootScope.ngp.toStateParams;
            $state.go('login');
            return false;
        },

        setAuthenticated : function(){
            _authenticated = true;
        },

        setNotAuthenticated : function(){
            _user = undefined;
            _authenticated = false;
            $cookieStore.remove('user');
        },

        isSet: function() {
            console.log('_user', _user);
            return _user && angular.isDefined(_user.token)
        },
        isAuthenticated: function() {
            return _authenticated;
        },
        isInRole: function(role) {
            if (!_authenticated || !_user.roles) return false;

            return _user.roles.indexOf(role) != -1;
        },
        isInAnyRole: function(roles) {
            if (!_authenticated || !_user.roles) return false;

            for (var i = 0; i < roles.length; i++) {
                if (this.isInRole(roles[i])) return true;
            }

            return false;
        }
    };
}