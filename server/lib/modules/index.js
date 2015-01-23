module.exports = function(_s){
    var rf = {};
    rf.User = require('./user.js')(_s);
    rf.Authorization = require('./authorization.js')(_s);
    rf.Validation = require('./supers/validation.js')(_s);
    rf.ValidationReg = require('./validationReg.js')(_s, rf);
    rf.uf = require('./utilFunc.js')(_s);
    rf.ajaxHandler = require('./ajaxHandler.js');
    rf.WebSocket = require('./webscoket.js');
    rf.router = require('./supers/router.js')(_s, rf);
    rf.msgRouter = require('./msgRouter.js')(_s, rf);
    rf.roomRouter = require('./roomRouter.js')(_s, rf);
    rf.chat = require('./chat.js');

    return rf;
};