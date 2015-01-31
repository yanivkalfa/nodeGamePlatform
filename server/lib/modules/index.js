module.exports = function(_s){
    var rf = {};
    rf.HttpTransit = require('./httpTransit.js')(_s);
    rf.User = require('./user.js')(_s);
    rf.Servers = require('./servers.js')(_s, rf);
    rf.Authorization = require('./authorization.js')(_s);
    rf.Validation = require('./supers/validation.js')();
    rf.ValidationReg = require('./validationReg.js')(_s,rf);
    rf.uf = require('./utilFunc.js')(_s);
    rf.ajaxHandler = require('./ajaxHandler.js');
    rf.RoomHandler = require('./roomHandler.js')(_s,rf);
    rf.GetRooms = require('./getRooms.js')(_s,rf);
    rf.GetRoom = require('./getRoom.js')(_s,rf);
    rf.Router = require('./supers/router.js')();
    rf.RoutMsg = require('./routMsg.js')(_s,rf);
    rf.RoutRemoteMsg = require('./routRemoteMsg.js')(_s,rf);
    rf.RoutRoom = require('./routRoom.js')(_s,rf);
    rf.RoutChat = require('./routChat.js')(_s,rf);
    rf.RoutSocket = require('./routSocket.js')(_s, rf);

    return rf;
};