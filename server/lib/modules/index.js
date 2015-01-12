module.exports = function(_s){
    var rf = {};
    rf.uf = require('./utilFunc.js')(_s);
    rf.ajaxHandler = require('./ajaxHandler.js');
    rf.User = require('./User.js')(_s);

    return rf;
};