module.exports = function(_s){
    console.log('got to User');
    var _user = undefined
        , _ = _s.oReq.lodash
        , visibleField = ['id','username', 'firstName','lastName','email','roles','rooms','token', 'type']
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

        clone : function(user){
            var self = this;
            return _.pick(_.cloneDeep(user._doc), self.visibleField());
        },

        getRoles: function() {
            return _user.roles;
        },

        set: function(user) { return _user = user ? _.pick(user, visibleField) : undefined; },

        fetchUsers : function(credentials){
            return new _s.oReq.Promise(function(resolve, reject) {
                Users.find(credentials).exec(function (err, users) {
                    if(err) return reject(err);
                    return resolve(users);
                });
            });
        },

        fetchUser : function(user){

            var id
                , username
                , credentials = {}
                ;

            user = user || {};
            id = user.id || undefined;
            username = user.username || user || undefined;

            if(!id && !username) return false;

            credentials = id ? {"_id" : id } : {"username" : username };

            return new _s.oReq.Promise(function(resolve, reject) {
                Users.findOne(credentials).exec(function (err, user) {
                    if(err) return reject(err);
                    return resolve(user);
                });
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

        updateRooms : function(credentials, update){
            return new _s.oReq.Promise(function(resolve, reject) {
                Users.update(credentials, update).exec(function (err, user) {
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
        }

    };
};