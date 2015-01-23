module.exports = function(_s, _rf){

    var  _ = _s.oReq.lodash
        , User = _rf.User
        ;

    function RoomHandler(){
        this.rooms = [];
        this.roomNames = [];
        this.roomsSparks = [];
        this.sparkList = {};
        this.unique = {};
        this.inSparks = [];

    }

    RoomHandler.prototype = {


        assembleRooms : function(){
            var self = this;
            self.roomNames.forEach(function(room, index){
                self.rooms.push({
                    id : room,
                    title : room,
                    content : {
                        msg : [],
                        members : self.getSparksForRoom(index)
                    },
                    active : false
                });
            });

            console.log(self.roomNames);
            return this;
        },


        setRoomNames : function(rooms){
            if(!_.isArray(rooms)) return false;

            this.roomNames = rooms.filter(function(room){
                return !(room.indexOf("u_") === 0 || room === 'terminal');
            });
            return this;
        },

        setRoomsSparks : function(roomsSparks){
            this.roomsSparks = roomsSparks;
            return this;
        },

        setSparkList : function(){
            var self = this;
            this.roomsSparks.forEach(function(sparkInRoom){
                if(!_.isArray(sparkInRoom)) return false;
                for(var i=0; i < sparkInRoom.length; i++ ){
                    self.sparkList[sparkInRoom[i]] = false;
                }
            });
            return this;
        },

        setInSpark : function(){
            var self = this;
            _(self.sparkList).forEach(function(spark, sparkId) {
                if(!spark) self.inSparks.push(sparkId);
            });
            return this;
        },

        checkUserNameInPrimus : function(){
            var self = this;
            _s.primus.forEach(function (primSpark, next) {
                _(self.sparkList).forEach(function(spark, sparkId) {
                    if(primSpark.id == sparkId){
                        self.sparkList[sparkId] = {username : primSpark.user.username, id : primSpark.user.id};
                        return false;
                    }
                });
                next();
            }, function (err) {});
            return this;
        },
        checkUserNameInDB : function(users){
            if(!_.isArray(users)) return false;
            var self = this;
            users.forEach(function(user){
                self.sparkList[user.spark] = {username : user.username, id : user.id};
            });

            return this;
        },

        cleanSparkList : function(){
            var self = this;
            _(self.sparkList).forEach(function(spark, sparkId) {
                if(!spark) delete self.sparkList[sparkId];
                if(!self.unique[spark.id] ) self.unique[spark.id] = {count:0, sparkId : sparkId};
                self.unique[spark.id].count++;
            });

            _(self.unique).forEach(function(uniqueSpark, index) {
                if(uniqueSpark.count > 1) delete self.sparkList[uniqueSpark.sparkId];
            });

            return this;
        },

        fetchUsersInSparks : function(){
            var self = this;
            return new _s.oReq.Promise(function(resolve, reject) {
                User.fetchUsers({ 'spark': { $in: self.inSparks }}).then(resolve).catch(reject);
            });
        },

        getRooms : function(){
            return this.rooms;
        },

        getSparksForRoom : function(index){
            var sparksForRoom = [], self = this;
            _(self.roomsSparks).forEach(function(sparkInRoom, roomIndex){
                if(roomIndex !== index) return true;
                for(var i=0; i < sparkInRoom.length; i++ ){
                    sparksForRoom.push(self.sparkList[sparkInRoom[i]]);
                }
                return false;
            });

            return sparksForRoom;
        },

        getSparksForAllRooms : function(roomsSparkPromises){
            return new _s.oReq.Promise(function(resolve, reject) {
                _s.oReq.Promise.all(roomsSparkPromises).then(resolve).catch(reject)
            });
        },

        getRoomsForSpark : function(spark){
            return new _s.oReq.Promise(function(resolve, reject) {
                _s.primus.rooms(spark, function(err, rooms){
                    if(err) return reject(err);
                    return resolve(rooms);
                });
            });
        },

        getSparksInRoom : function(room){
            return new _s.oReq.Promise(function(resolve, reject) {
                _s.primus.room(room).clients(function(err, sparks){
                    if(err) return reject(err);
                    return resolve(sparks);
                });
            });
        },

        destroy : function(room){
            this.rooms = [];
            this.roomNames = [];
            this.roomsSparks = [];
            this.sparkList = {};
            this.unique = {};
            this.inSparks = [];
            return this;
        }
    };

    return RoomHandler;

};


//RoomHandler

/*
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
};*/

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