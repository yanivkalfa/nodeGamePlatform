
module.exports.roomHandler = {

    rooms : {},
    _members : {},
    _to : {
        type : "notSet",
        to : ""
    },
    _io : {},
    _socket : {},

    join : function(rName, nickname){
        var _this = this;
        if(typeof _this.rooms[rName] === "undefined")
        {
            _this.rooms[rName] = [];
        }
        if(_this.rooms[rName].indexOf(nickname) > -1){
            return false;
        }

        _this.rooms[rName].push(nickname);
        return true;
    },
    leave : function(rName, nickname){
        var _this = this;
        if(typeof _this.rooms[rName] === "undefined")
        {
            return false;
        }
        var index = _this.rooms[rName].indexOf(nickname);
        if(index === -1)
        {
            return false;
        }
        _this.rooms[rName].splice(index, 1);

        if(_this.rooms[rName].length === 0){
            delete _this.rooms[rName];
        }

        return true;
    },
    leaveAll : function(nickname){
        var _this = this;
        for(var rName in _this.rooms){
            var index = _this.rooms[rName].indexOf(nickname);
            if(index > -1)
            {
                _this.rooms[rName].splice(index,1);
            }
        }
    },

    to : function(to){
        this._to.type = (to === "all") ? "all" : (Array.isArray(to)) ? "array" : typeof to;
        this._to.to = to;
        return this;
    },
    emit : function(event,object){
        var _this = this;
        switch(this._to.type){
            case "string":
                this.rooms[this._to.to].map(function(memberName){
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
    }
};