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
    rf.RoutMsg = require('./routMsg.js')(rf);
    rf.RoutRoom = require('./routRoom.js')(rf);
    rf.Chat = require('./chat.js')(rf);

    return rf;
};