module.exports = function(_s){
    var _user = undefined
        , _rout = undefined
        , _authenticated = false
        , _ = _s.oReq.lodash
        ;

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
            return !_.isEmpty(_user);
        },

        login : function(credentials){
            return new _s.oReq.Promise(function(resolve, reject) {
                Users.findOne(credentials).populate('queues').exec(function (err, user) {
                    if(err) return reject(err);
                    return resolve(user);
                });
            });
        },

        logout : function(req, res){

            _s.primus.forEach(function (spark, next) {
                if(spark.user.id == req.session.user.id){
                    spark.end();
                    next(undefined, false);
                }else{
                    next();
                }
            }, function (err) {
                req.session.user = undefined;
            });
        },

        authenticate: function() {
            return _authenticated = (!_.isEmpty(_user) && this.isInAnyRole(_rout.roles || []))
        },

        isAuthenticated: function() {
            return _authenticated;
        },

        isInRole: function(role) {
            if(_.isEmpty(_user) || _.isEmpty(_user.roles)) return false;
            return _user.roles.indexOf(role) != -1;
        },

        isInAnyRole: function(roles) {
            if(roles.length <= 0) return true;
            if(_.isEmpty(_user) || _.isEmpty(_user.roles)) return false;

            for (var i = 0; i < roles.length; i++) {
                if (this.isInRole(roles[i])) return true;
            }

            return false;
        }
    };
};