module.exports = function(_s){
    var rf = {}
        , pathsList = _s.oConfig.pathsList
        ;
    rf.uf = require(pathsList.uf);//();//(_s);
    console.log('got here ');
    rf.GamesApi = require(pathsList.GamesApi)(_s);
    rf.SocketAjax = require(pathsList.SocketAjax)(_s);
    console.log('got here ');
    rf.HttpTransit = require(pathsList.HttpTransit)(_s);
    console.log('got here ');
    rf.User = require(pathsList.User)(_s);
    rf.Servers = require(pathsList.Servers)(_s, rf);
    rf.Authorization = require(pathsList.Authorization)(_s);
    rf.Validation = require(pathsList.Validation)();
    rf.ValidationReg = require(pathsList.ValidationReg)(_s,rf);
    rf.ajaxHandler = require(pathsList.ajaxHandler);
    console.log('got here ');
    rf.RoomHandler = require(pathsList.RoomHandler)(_s,rf);
    rf.GetRooms = require(pathsList.GetRooms)(_s,rf);
    rf.GetRoom = require(pathsList.GetRoom)(_s,rf);
    rf.Router = require(pathsList.Router)();
    rf.RoutMsg = require(pathsList.RoutMsg)(_s,rf);
    console.log('got here ');
    rf.RoutRemoteMsg = require(pathsList.RoutRemoteMsg)(_s,rf);
    console.log('got here a');
    rf.RoutRoom = require(pathsList.RoutRoom)(_s,rf);
    console.log('got here b');
    rf.RoutChat = require(pathsList.RoutChat)(_s,rf);
    console.log('got here c', pathsList.RoutSjax);
    rf.RoutSjax = require(pathsList.RoutSjax)(_s,rf);
    console.log('got here d');
    rf.RoutQueue = require(pathsList.RoutQueue)(_s,rf);
    console.log('got here ');
    rf.RoutSocket = require(pathsList.RoutSocket)(_s, rf);
    console.log('got here ');

    return rf;
};