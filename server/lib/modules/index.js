module.exports = function(_s){
    var rf = {};
    rf.User = require('./user.js')(_s);
    rf.Authorization = require('./authorization.js')(_s);
    rf.Validation = require('./supers/validation.js')(_s);
    rf.ValidationReg = require('./validationReg.js')(rf);
    rf.uf = require('./utilFunc.js')(_s);
    rf.ajaxHandler = require('./ajaxHandler.js');
    rf.WebSocket = require('./webscoket.js');
    rf.Router = require('./supers/router.js')(_s);
    rf.RouterMsg = require('./routerMsg.js')(rf);
    rf.RouterRoom = require('./routerRoom.js')(rf);
    rf.Chat = require('./chat.js');

    return rf;
};