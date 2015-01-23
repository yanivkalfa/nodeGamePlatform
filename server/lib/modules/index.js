module.exports = function(_s){
    var rf = {};
    rf.User = require('./user.js')(_s);
    rf.Authorization = require('./authorization.js')(_s);
    rf.Validation = require('./supers/validation.js')();
    rf.ValidationReg = require('./validationReg.js')(_s,rf);
    rf.uf = require('./utilFunc.js')(_s);
    rf.ajaxHandler = require('./ajaxHandler.js');
    rf.RoomHandler = require('./roomHandler.js')(_s);
    rf.WebSocket = require('./roomHandler.js');
    rf.Router = require('./supers/router.js')();
    rf.RoutMsg = require('./routMsg.js')(_s,rf);
    rf.RoutRoom = require('./routRoom.js')(_s,rf);
    rf.Chat = require('./chat.js')(rf);

    return rf;
};