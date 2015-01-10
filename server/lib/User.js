module.exports = function(rf){
    var _user = undefined,
        _rout = undefined,
        _authenticated = false,
        _ = rf.lodash;

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

        init: function(user, rout) {
            _user = user;
            _rout = rout;
            this.authenticate();
        },

        isResolved: function() {
            return !_.isUndefined(_user);
        },

        authenticate: function() {
            return _authenticated = (!_.isUndefined(_user) && this.isInAnyRole(_rout.roles || []))
        },

        isAuthenticated: function() {
            return _authenticated;
        },
        isInRole: function(role) {
            return _user.roles.indexOf(role) != -1;
        },
        isInAnyRole: function(roles) {
            if(roles.length <= 0) return true;

            for (var i = 0; i < roles.length; i++) {
                if (this.isInRole(roles[i])) return true;
            }

            return false;
        }
    };
};