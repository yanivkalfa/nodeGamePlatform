module.exports = function(_s){
    var _user = undefined,
        _authenticated = false,
        _ = _s.oReq.lodash;

    return {
        get: function() {
            return _user;
        },
        getRoles: function() {
            return _user.roles;
        },

        set: function(user) {
            _user = user;
        },

        init: function(user) {
            _user = user;
            _authenticated = !_.isUndefined(_user);

            return _user;
        },

        isResolved: function() {
            return !_.isUndefined(_user);
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
};