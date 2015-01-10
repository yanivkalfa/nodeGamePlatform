
module.exports = {
    admin : {
        roles : ['registered']
    },
    denied : {
        roles : []
    },
    game : {
        roles : ['registered']
    },
    home : {
        roles : []
    },
    login : {
        roles : []
    },
    register : {
        roles : []
    },
    restricted : {
        roles : []
    },
    getRout : function(path){
        return this[path];
    },
    loginRequired : function(path){
        return (typeof this[path].roles !== 'undefined' && Array.isArray(this[path].roles) && this[path].roles.length > 0) ? true : false;
    }
};