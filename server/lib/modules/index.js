module.exports = function(_s){
    var rf = {};
    rf.User = require('./User.js')(_s);
    rf.uf = require('./utilFunc.js')(_s);
    rf.ajaxHandler = require('./ajaxHandler.js');
    rf.WebSocket = require('./webscoket.js');
    rf.msgRouter = require('./msgRouter.js');
    rf.roomRouter = require('./roomRouter.js');
    rf.chat = require('./chat.js');

    return rf;
};