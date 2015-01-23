module.exports = function(_s){
    var rf = {};
    rf.User = require('./user.js')(_s);
    rf.Authorization = require('./authorization.js')(_s);
    rf.Validation = require('./validation.js')(_s);
    rf.RegValidation = require('./regValidation.js')(_s);
    rf.uf = require('./utilFunc.js')(_s);
    rf.ajaxHandler = require('./ajaxHandler.js');
    rf.WebSocket = require('./webscoket.js');
    rf.msgRouter = require('./msgRouter.js');
    rf.roomRouter = require('./roomRouter.js');
    rf.chat = require('./chat.js');

    return rf;
};