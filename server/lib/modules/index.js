module.exports = function(_s){
    var rf = {}
        , pathsList = _s.oConfig.pathsList
        ;

    rf.uf = require(pathsList.uf);//();//(_s);
    rf.GamesApi = require(pathsList.GamesApi)(_s);
    rf.SocketAjax = require(pathsList.SocketAjax)(_s);
    rf.HttpTransit = require(pathsList.HttpTransit)(_s);
    rf.User = require(pathsList.User)(_s);
    rf.Servers = require(pathsList.Servers)(_s, rf);
    rf.Authorization = require(pathsList.Authorization)(_s);
    rf.Validation = require(pathsList.Validation)();
    rf.ValidationReg = require(pathsList.ValidationReg)(_s,rf);
    rf.ajaxHandler = require(pathsList.ajaxHandler);
    rf.RoomHandler = require(pathsList.RoomHandler)(_s,rf);
    rf.GetRooms = require(pathsList.GetRooms)(_s,rf);
    rf.GetRoom = require(pathsList.GetRoom)(_s,rf);
    rf.Router = require(pathsList.Router)()();
    rf.RoutMsg = require(pathsList.RoutMsg)(_s,rf);
    rf.RoutRemoteMsg = require(pathsList.RoutRemoteMsg)(_s,rf);
    rf.RoutRoom = require(pathsList.RoutRoom)(_s,rf);
    rf.RoutChat = require(pathsList.RoutChat)(_s,rf);
    rf.RoutSjax = require(pathsList.RoutSjax)(_s,rf);
    rf.RoutQueue = require(pathsList.RoutQueue)(_s,rf);
    rf.RoutSocket = require(pathsList.RoutSocket)(_s, rf);
 
    return rf;
};