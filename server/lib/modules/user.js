module.exports = function(_s){
    var _user = undefined
        , _ = _s.oReq.lodash
        , visibleField = ['id','username', 'firName','lastName','email','roles', 'token']
        ;

    return {
        init : function(user){

            if(typeof user !== 'object' || !user.id || !user.username) return false;

            return this.set(user);
        },

        get: function() {
            return _user;
        },

        visibleField: function() {
            return visibleField;
        },

        getRoles: function() {
            return _user.roles;
        },

        set: function(user) { return _user = user ? _.pick(user, visibleField) : undefined; },

        fetchUser : function(user){

            var id
                , username
                , credentials = {}
                , success
                , fail
                , self = this
                ;

            user = user || {};
            id = user.id || undefined;
            username = user.username || user || undefined;

            if(!id && !username) return false;

            credentials = id ? {"id" : id } : {"username" : username };

            return new _s.oReq.Promise(function(resolve, reject) {

                fail = function(err){
                    self.set(undefined);
                    if(err) return reject(err);
                };

                success = function(user){
                    return resolve(self.set(user));
                };

                Users.findOne(credentials).exec(function (err, user) {
                    if(err) return fail(err);
                    return success(user);
                });
            });
        }
    };
};