module.exports = function(_s){
    var _user = undefined,
        _rout = undefined,
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



        init: function(user, rout) {
            _user = user;
            _rout = rout;
            this.authenticate();
        },

        isResolved: function() {
            return !_.isUndefined(_user);
        },

        login : function(credentials){
            return new _s.oReq.Promise(function(resolve, reject) {
                Users.findOne(credentials).exec(function (err, user) {
                    if(err) return reject(err);
                    return resolve(user);
                });
            });
        },

        logout : function(req, res){
            //console.log(_s.primus);

            /*
            _s.primus.forEach(function(spark, next){
                console.log(spark.userId);
                if(spark.userId == req.session.user.id){
                    spark.end();
                    next(undefined, false);
                }
            });*/

            _s.primus.forEach(function (spark, next) {
                console.log(spark.id);
                if(spark.userId == req.session.user.id){
                    spark.end();
                    next();
                }
            }, function (err) {
                console.log('We are done');
            });

            console.log('got here');
            req.session.user = {};
        },

        checkUserDetails : function(userDetails){
            return true;
        },

        authenticate: function() {
            return _authenticated = (!_.isUndefined(_user) && this.isInAnyRole(_rout.roles || []))
        },

        isAuthenticated: function() {
            return _authenticated;
        },

        isInRole: function(role) {
            if(_.isUndefined(_user.roles)) return -1;
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