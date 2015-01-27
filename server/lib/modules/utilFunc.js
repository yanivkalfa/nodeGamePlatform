module.exports = function(_s){
    return {

        getServer : function(){

        },

        extend : function(source,extend){
            for(var key in extend){
                source.prototype[key] = extend[key];
            }
        }

    };
};

/*
 routFiles : function(req, res, location, fileName){
 _s.oReq.fs.exists(_s.sClientDirname + location + fileName, function(exists) {
 if (exists) {
 res.sendFile(_s.sClientDirname + location + fileName);
 }
 else
 {
 res.status(404).send('404 page !!!!');
 }
 });
 },*/


/*
module.exports = {
    s : {},

    CallRouter : function(oSocket){
        var _this = this;
        this.oSocket = oSocket;

        this.init = function(){
            _this.oSocket.on('request', function(req){
                _this[req.method](req.msg);
            });
        };

        this.init();
    },

    MsgRouter : function(roomHandler){
        var _this = this;
        this.roomHandler = roomHandler;

        this.routMsg = function(args){
            var toEmit;
            switch(args.msg.toType){
                case "room":
                    _this.roomHandler.to(args.msg.to).broadCast('response', {"method": "msg", "msg":args});
                    break;
                case "private":
                    if(typeof _this.roomHandler._members[args.msg.to] === "undefined")
                    {
                        toEmit = {
                            "action" : "add",
                            "msg" : {
                                "toType" : "warning",
                                "to" : args.msg.from,
                                "from" : "System",
                                "date" : args.msg.date,
                                "msg" : "User [" + args.msg.to + "] does not exist."
                            }
                        };
                        _this.roomHandler._socket.emit('response', {"method": "msg", "msg":toEmit});
                    }
                    else if(args.msg.to == _this.roomHandler._socket.decoded_token.nickName)
                    {
                        toEmit = {
                            "action" : "add",
                            "msg" : {
                                "toType" : "warning",
                                "to" : args.msg.from,
                                "from" : "System",
                                "date" : args.msg.date,
                                "msg" : "Cannot whisper You're self!!"
                            }
                        };
                        _this.roomHandler._socket.emit('response', {"method": "msg", "msg":toEmit});
                    }
                    else
                    {
                        _this.roomHandler._members[args.msg.to].emit('response', {"method": "msg", "msg":args});
                    }
                    break;
            }
        };
    },

    roomRouter : function(roomHandler){
        var _this = this;
        this.roomHandler = roomHandler;

        this.routRoom = function(args){
            var toEmit;
            switch(args.msg.type){
                case "chat":
                    _this.roomHandler[args.action](args.msg);
                    break;
                case "game":
                    if(typeof _this.roomHandler._members[args.msg.to] === "undefined")
                    {
                        toEmit = {
                            "action" : "add",
                            "msg" : {
                                "toType" : "warning",
                                "to" : args.msg.from,
                                "from" : "System",
                                "date" : args.msg.date,
                                "msg" : "User [" + args.msg.to + "] does not exist."
                            }
                        };
                        _this.roomHandler._socket.emit('response', {"method": "msg", "msg":toEmit});
                    }
                    else if(args.msg.to == _this.roomHandler._socket.decoded_token.nickName)
                    {
                        toEmit = {
                            "action" : "add",
                            "msg" : {
                                "toType" : "warning",
                                "to" : args.msg.from,
                                "from" : "System",
                                "date" : args.msg.date,
                                "msg" : "Cannot whisper You're self!!"
                            }
                        };
                        _this.roomHandler._socket.emit('response', {"method": "msg", "msg":toEmit});
                    }
                    else
                    {
                        _this.roomHandler._members[args.msg.to].emit('response', {"method": "msg", "msg":args});
                    }
                    break;
            }
        };
    },

    extend : function(source,extend){
        for(var key in extend){
            source.prototype[key] = extend[key];
        }
    }
};
*/

