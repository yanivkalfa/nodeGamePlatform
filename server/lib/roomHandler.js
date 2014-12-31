module.exports = function(rooms, io,members,socket){
    var _this = this;
    this.rooms = rooms;
    this._members = members;
    this._to = {
        type : "notSet",
        to : ""
    };
    this._io = io;
    this._socket = socket;

    this._join = function(rName, nickname, type){
        var index;
        index = this.findRoomIndex(rName);
        if(index === -1)
        {
            _this.rooms.push({
                "type" : (typeof type !== "undefined") ? type : "chat",
                "members" : [nickname],
                "name" : rName
            });
        }
        else
        {
            if(_this.rooms[index].members.indexOf(nickname) > -1){
                return false;
            }

            _this.rooms[index].members.push(nickname);
        }

        return true;
    };

    this.join = function(room){
        var _this = this, aRoom;

        _this._join(room.name, room.nickName, room.type || "chat");
        aRoom = _this.getRoom(room.name);

        _this.to(room.name).broadCast('response', {"method": "roomDo", "msg":{
            "action" : "join",
            "msg" : {
                "name" : room.name,
                "type" : aRoom.type,
                "nickName" : room.nickName
            }
        }});

        _this._socket.emit('response', {"method": "updateRoomMembers", "msg":{
            "action" : "join",
            "msg" : {
                "name" : room.name,
                "type" : aRoom.type,
                "nickName" : aRoom.members
            }
        }});
    };

    this._leave = function(rName, nickname){
        var index;
        index = this.findRoomIndex(rName);

        if(index === -1)
            return false;

        var memberIndex = _this.rooms[index].members.indexOf(nickname);

        if(memberIndex === -1)
            return false;

        _this.rooms[index].members.splice(memberIndex, 1);

        if(_this.rooms[index].members.length === 0 && rName != "lobby")
            _this.rooms.splice(index,1);

        return true;
    };

    this.leave = function(room){
        var _this = this, aRoom;
        _this._leave(room.name, room.nickName);
        aRoom = _this.getRoom(room.name);

        if(aRoom){
            _this.to(room.name).broadCast('response', {"method": "roomDo", "msg":{
                "action" : "leave",
                "msg" : {
                    "name" : room.name,
                    "type" : aRoom.type,
                    "nickName" : room.nickName
                }
            }});
        }
    };

    this.leaveAll = function(nickname){
        var _this = this;
        for(var i = 0; i < _this.rooms.length; i++ ){
            _this.leave({
                "name" : _this.rooms[i].name,
                "nickName" : nickname
            });
        }
        return true;
    };

    this.to = function(to){
        _this._to.type = (to === "all") ? "all" : (Array.isArray(to)) ? "array" : typeof to;
        _this._to.to = to;
        return _this;
    };

    this.emit = function(event,object){
        if(!_this.checkIfToExist()) return false;

        switch(_this._to.type){
            case "string":
                var index = _this.findRoomIndex(this._to.to);
                this.rooms[index].members.map(function(memberName){
                    _this._members[memberName].emit(event, object);
                });
                break;
            case "object":
                _this._to.to.emit(event, object);
                break;
            case "array":
                _this._to.to.map(function(socket){
                    socket.emit(event, object);
                });
                break;
            case "notSet":
                _this._socket.emit(event, object);
                break;
            case "all":
                _this._io.emit(event, object);
                break;
            default :
                return _this;
        }

        return _this;
    };

    this.broadCast = function(event,object){
        if(!_this.checkIfToExist()) return false;

        switch(_this._to.type){
            case "string":
                var index = _this.findRoomIndex(_this._to.to);
                this.rooms[index].members.map(function(memberName){
                    if(!_this.compareSockets(_this._members[memberName])){
                        _this._members[memberName].emit(event, object);
                    }
                });
                break;
            case "array":
                _this._to.to.map(function(socket){
                    if(!_this.compareSockets(socket)){
                        socket.emit(event, object);
                    }
                });
                break;
            case "all":
                _this._io.emit(event, object);
                break;
            default :
                return _this;
        }

        return _this;
    };

    this.checkIfToExist = function(){
        var toReturn = true,error, toEmit;

        switch(_this._to.type){
            case "string":
                var index = _this.findRoomIndex(_this._to.to);
                toReturn = (index !== -1);
                error = "Room [" + _this._to.to + "] does not exist.";
                break;
            case "object":
                toReturn = (typeof _this._to.to.emit !== "function");
                error = "The above object cannot emit and therefore is not a socket";
                break;
            case "array":
                _this._to.to.map(function(socket){
                    if(typeof socket.emit !== "function"){
                        toReturn = false;
                        error = "One or more of the supplied objects cannot emit and therefore is not a socket";
                    }
                });
                break;
        }

        if(!toReturn){
            toEmit = {
                "action" : "add",
                "msg" : {
                    "toType" : "warning",
                    "to" : _this._socket.decoded_token.nickName,
                    "from" : "System",
                    "date" : Date.now(),
                    "msg" : error
                }
            };
            _this._socket.emit('response', {"method": "msg", "msg":toEmit});
        }

        return toReturn;
    };

    this.getRoom = function(rName){
        var _this = this;
        return (typeof _this.rooms[_this.findRoomIndex(rName)] !== "undefined") ? _this.rooms[_this.findRoomIndex(rName)] : false;
    };

    this.findRoomIndex = function(rName){
        var toReturn = -1, i, room;
        for(i = 0; i < _this.rooms.length; i++){
            room = _this.rooms[i];
            if(room.name == rName){
                toReturn = i;
                break;
            }
        }

        return toReturn;
    };

    this.compareSockets = function(compareSocket){
        return _this._socket.decoded_token.nickName == compareSocket.decoded_token.nickName;
    };
};

/*
module.exports = {

    rooms : {},
    _members : {},
    _to : {
        type : "notSet",
        to : ""
    },
    _io : {},
    _socket : {},

    join : function(rName, nickname, type){
        var _this = this, index;
        index = this.findRoomIndex(rName);
        if(index === -1)
        {
            _this.rooms.push({
                "type" : (typeof type !== "undefined") ? type : "chat",
                "members" : [nickname],
                "name" : rName
            });
        }
        else
        {
            if(_this.rooms[index].members.indexOf(nickname) > -1){
                return false;
            }

            _this.rooms[index].members.push(nickname);
        }

        return true;
    },
    leave : function(rName, nickname){
        var _this = this, index;
        index = this.findRoomIndex(rName);

        if(index === -1)
            return false;

        var memberIndex = _this.rooms[index].members.indexOf(nickname);

        if(memberIndex === -1)
            return false;

        _this.rooms[index].members.splice(memberIndex, 1);

        if(_this.rooms[index].members.length === 0 && rName != "lobby")
            _this.rooms.splice(index,1);

        return true;
    },
    leaveAll : function(nickname){
        var _this = this;
        for(var i = 0; i < _this.rooms.length; i++ ){
            this.leave(_this.rooms[i].name, nickname);
        }

        return true;
    },

    to : function(to){
        this._to.type = (to === "all") ? "all" : (Array.isArray(to)) ? "array" : typeof to;
        this._to.to = to;
        return this;
    },
    emit : function(event,object){
        var _this = this;

        if(!this.checkIfToExist()) return false;

        switch(this._to.type){
            case "string":
                var index = this.findRoomIndex(this._to.to);
                this.rooms[index].members.map(function(memberName){
                    _this._members[memberName].emit(event, object);
                });
                break;
            case "object":
                this._to.to.emit(event, object);
                break;
            case "array":
                this._to.to.map(function(socket){
                    socket.emit(event, object);
                });
                break;
            case "notSet":
                this._socket.emit(event, object);
                break;
            case "all":
                this._io.emit(event, object);
                break;
            default :
                return this;
        }

        return this;
    },
    broadCast : function(event,object){
        var _this = this;

        if(!this.checkIfToExist()) return false;

        switch(this._to.type){
            case "string":
                var index = this.findRoomIndex(this._to.to);
                this.rooms[index].members.map(function(memberName){
                    if(!_this.compareSockets(_this._members[memberName])){
                        _this._members[memberName].emit(event, object);
                    }
                });
                break;
            case "array":
                this._to.to.map(function(socket){
                    if(!_this.compareSockets(socket)){
                        socket.emit(event, object);
                    }
                });
                break;
            case "all":
                this._io.emit(event, object);
                break;
            default :
                return this;
        }

        return this;
    },

    checkIfToExist : function(){
        var toReturn = true,_this = this, error, toEmit;

        switch(this._to.type){
            case "string":
                var index = this.findRoomIndex(this._to.to);
                toReturn = (index !== -1);
                error = "Room [" + this._to.to + "] does not exist.";
                break;
            case "object":
                toReturn = (typeof this._to.to.emit !== "function");
                error = "The above object cannot emit and therefore is not a socket";
                break;
            case "array":
                this._to.to.map(function(socket){
                    if(typeof socket.emit !== "function"){
                        toReturn = false;
                        error = "One or more of the supplied objects cannot emit and therefore is not a socket";
                    }
                });
                break;
        }

        if(!toReturn){
            toEmit = {
                "action" : "add",
                "msg" : {
                    "toType" : "warning",
                    "to" : _this._socket.decoded_token.nickName,
                    "from" : "System",
                    "date" : Date.now(),
                    "msg" : error
                }
            };
            _this._socket.emit('response', {"method": "msg", "msg":toEmit});
        }

        return toReturn;
    },

    findRoomIndex : function(rName){
        var _this = this, toReturn = -1, i, room;
        for(i = 0; i < _this.rooms.length; i++){
            room = _this.rooms[i];
            if(room.name == rName){
                toReturn = i;
                break;
            }
        }

        return toReturn;
    },

    compareSockets : function(compareSocket){
        var _this = this;
        return _this._socket.decoded_token.nickName == compareSocket.decoded_token.nickName;
    }
};
*/