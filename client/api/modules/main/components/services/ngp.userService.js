/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .factory('User', [
        '$q',
        '$http',
        '$timeout',
        '$cookieStore',
        userFactory
    ]);

function userFactory($q, $http, $timeout, $cookieStore) {
    var _user = undefined,
        _authenticated = false;

    return {
        getUser: function() {
            return _user;
        },
        getUserRoles: function() {
            return _user.roles;
        },


        setUser: function(force) {
            if (force === true) _user = undefined;
            if (angular.isDefined(_user)) return _user;
            _user = $cookieStore.get("user") || false;
            this.authenticate(_user);
            return _user;
        },

        authenticate: function(user) {
            _user = user;
            _authenticated = user != null;

            if (user) $cookieStore.put("user", user);
            else $cookieStore.remove("user");
        },

        isResolved: function() {
            console.log(_user);
            return angular.isDefined(_user);
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