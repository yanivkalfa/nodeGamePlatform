module.exports = function(_s){
    var rf = {};
    rf.User = require('./User.js')(_s);
    rf.uf = require('./utilFunc.js')(_s);
    rf.ajaxHandler = require('./ajaxHandler.js');

    return rf;
};