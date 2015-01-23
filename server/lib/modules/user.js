module.exports = function(_s){
    var _user = undefined
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

        fetchUser : function(){

        }
    };
};