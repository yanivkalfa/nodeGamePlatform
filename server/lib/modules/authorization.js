module.exports = function(_s){

    var _ = _s.oReq.lodash;

    function Authorization(user, rout){
        this._user = user || undefined;
        this._rout = rout || undefined;
        this._authenticated = false;
        this.authenticate();
    }


    Authorization.prototype =  {

        get: function() {
            return this._user;
        },
        getRoles: function() {
            return this._user.roles;
        },

        set: function(user) {
            this._user = user;
        },

        isResolved: function() {
            return !_.isUndefined(this._user);
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
                if(spark.user.id == req.session.user.id){
                    spark.end();
                    next(undefined, false);
                }else{
                    next();
                }
            }, function (err) {
                req.session.user = {};
            });
        },

        authenticate: function() {
            return this._authenticated = (!_.isUndefined(this._user) && this.isInAnyRole(this._rout.roles || []))
        },

        isAuthenticated: function() {
            return this._authenticated;
        },

        isInRole: function(role) {
            if(_.isUndefined(this._user.roles)) return -1;
            return this._user.roles.indexOf(role) != -1;
        },

        isInAnyRole: function(roles) {
            if(roles.length <= 0) return true;

            for (var i = 0; i < roles.length; i++) {
                if (this.isInRole(roles[i])) return true;
            }

            return false;
        }
    };


    return Authorization;
};