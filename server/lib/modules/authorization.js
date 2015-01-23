module.exports = function(_s){
    var _user = undefined
        , _rout = undefined
        , _authenticated = false
        , _ = _s.oReq.lodash
        , visibleField = ['id','username', 'firName','lastName','email','roles', 'token']
        ;

    return {
        get: function() {
            return _user;
        },
        visibleField: function() {
            return visibleField;
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

            _s.primus.forEach(function (spark, next) {
                if(spark.userId == req.session.user.id){
                    spark.end();
                    next(undefined, false);
                }else{
                    next();
                }
            }, function (err) {
                req.session.user = {};
            });
        },

        updateSpark : function(credentials, sparkId){
            return new _s.oReq.Promise(function(resolve, reject) {
                Users.update(credentials, {spark : sparkId}).exec(function (err, user) {
                    if(err) return reject(err);
                    return resolve(user);
                });
            });
        },

        getSparkId : function(credentials){
            return new _s.oReq.Promise(function(resolve, reject) {
                Users.findOne(credentials).exec(function (err, user) {
                    if(err) return reject(err);
                    return resolve(user.spark);
                });
            });
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