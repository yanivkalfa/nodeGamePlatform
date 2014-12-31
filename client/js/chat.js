(function($){
    $.fn.Chat = function(s){
        var _this = this;
        this.s = s;
        this._ChatModule = '';
        this._ChatView = '';
        this._ChatController = '';
        this._RouterExtender = '';

        this.ChatModule = function(){
            this._rooms = _this.s.oVars.oOptions.chGlobal.rooms;
            this._roomsInit = {};
            this._messages = [];
            this._isLocked = false;

            this.roomsReady = new _this.s.oFns.Event(this);

            this.joinRoom = new _this.s.oFns.Event(this);
            this.leaveRoom = new _this.s.oFns.Event(this);

            this.addMessage = new _this.s.oFns.Event(this);
            this.removeMessage = new _this.s.oFns.Event(this);

            this.isLockedReady = new _this.s.oFns.Event(this);
        };

        this.ChatModule.prototype = {

            fnRoomsReady : function (data) {
                // emit joined lobby
                this.roomsReady.notify({
                    "rooms" : data
                });
            },

            fnJoinRoom : function (data) {
                var index = _this.s.oFns.findRoomIndex(data.name), __this = this;
                if(index === -1)
                {
                    __this._rooms.push({
                        "type" : data.type || "chat",
                        "members" : [data.nickName],
                        "name" : data.name,
                        init : false
                    });
                }
                else
                {
                    var memberIndex = $.inArray(data.nickName,__this._rooms[index].members);
                    if(memberIndex == -1){
                        __this._rooms[index].members.push(data.nickName);
                        __this._rooms[index].members.sort(_this.s.oFns.sortToLower("ASC"));
                    }

                }

                __this._rooms.sort(_this.s.oFns.multiSortStrings("name", "ASC"));
                // emit joined room - and wait for members response

                this.joinRoom.notify({
                    "joinRoom" : data
                });
            },

            fnLeaveRoom : function (data) {
                var __this = this, index, emptyRoom = false;
                index = _this.s.oFns.findRoomIndex(data.name);

                if(index === -1)
                    return false;


                var memberIndex = $.inArray(data.nickName,__this._rooms[index].members);
                if(memberIndex === -1)
                    return false;

                __this._rooms[index].init.membersInit[data.nickName].destroy();
                delete __this._rooms[index].init.membersInit[data.nickName];
                __this._rooms[index].members.splice(memberIndex, 1);
                __this._rooms[index].members.sort(_this.s.oFns.sortToLower("ASC"));

                if(data.name != "lobby")
                {
                    __this._rooms[index].init.destroy();
                    __this._rooms.splice(index,1);

                }
                __this._rooms.sort(_this.s.oFns.multiSortStrings("name", "ASC"));
                // emit leave room
                this.leaveRoom.notify({
                    "leaveRoom" :data
                });

                return true;
            },

            fnAddMessage : function (data) {
                var __this = this;
                data.id = this.getLastMessageId();
                __this._messages.push(data);

                //this._messages.sort(_this.s.oFns.multiSort("date", "ASC"));
                // emit message
                this.addMessage.notify({
                    "message" : data
                });
            },

            fnRemoveMessage : function (data) {
                var __this = this, msg = data.message, msgIndex;
                msgIndex = __this.findMsgIndex(msg.id);

                if(msgIndex > -1){
                    __this._messages[msgIndex].init.destroy();
                    __this._messages.splice(msgIndex,1);
                }
                //this._messages.sort(_this.s.oFns.multiSort("date", "ASC"));
                // emit message
                this.removeMessage.notify({
                    "message" : ""
                });
            },

            setIsLocked : function (data) {
                this._isLocked = data;
            },

            getLastMessageId : function(){
                var id = -1, __this = this;
                for(var i = 0; i < __this._messages.length; i++){
                    if(__this._messages[i].id > id ){
                        id = __this._messages[i].id;
                    }
                }
                return id+1;
            },
            findMsgIndex : function(msgId){
                var id = -1, __this = this;
                for(var i = 0; i < __this._messages.length; i++){
                    if(__this._messages[i].id == msgId ){
                        id = i;
                        break
                    }
                }
                return id;
            }
        };

        this.ChatView = function(model){
            this._model = model;
            this._oBinds = _this.s.oBinds;

            this.roomsReady = new _this.s.oFns.Event(this);
            this.joinRoom = new _this.s.oFns.Event(this);
            this.leaveRoom = new _this.s.oFns.Event(this);
            this.addMessage = new _this.s.oFns.Event(this);
            this.removeMessage = new _this.s.oFns.Event(this);
            this.setIsLocked = new _this.s.oFns.Event(this);

            var __this = this;

            // attach model listeners
            this._model.roomsReady.attach(function (sender, args) {
                __this.fnRoomsReady(args);
            });

            this._model.joinRoom.attach(function (sender, args) {
                __this.fnRoomsReady(args);
                __this.fnJoinRoom(args);
                _this.s.oVars.oTabs.tabs( "refresh" );
            });

            this._model.leaveRoom.attach(function (sender, args) {
                __this.fnRoomsReady(args);
                __this.fnLeaveRoom(args);
                _this.s.oVars.oTabs.tabs( "refresh" );
            });
            
            this._model.addMessage.attach(function (sender, args) {
                __this.fnAddMessage(args);
            });

            this._model.removeMessage.attach(function (sender, args) {
                __this.fnRemoveMessage(args);
            });

            // tryingToConnect will trigger connect function
            this._oBinds.document.ready(function () {
                __this._roomsReady();
            });

            // attach listeners to HTML controls
            s.oBinds.tabs.off("click" ,__this._oBinds.submitMsg).on("click" ,__this._oBinds.submitMsg ,function(e){
                var val = $(this).siblings(__this._oBinds.msg).val(), msg,rname;

                if(val){
                    $(this).siblings(__this._oBinds.msg).val("");
                    rname = $(this).parents(".roomContainer").data("rName");
                    if(msg =_this.s.oVars.oTerminal.isMessageACommend(val)){
                        _this.s.oVars.oTerminal.analyseMessage(msg);
                    }else{
                        msg = "addMessage " + rname + " " + val;
                        _this.s.oVars.oTerminal.analyseMessage(msg);
                    }
                }
            });

            s.oBinds.tabs.off("keyup" ,__this._oBinds.msg).on("keyup" ,__this._oBinds.msg ,function(e){
                var key = e.keyCode || e.which, val, msg, rname;
                val = $(this).val();

                if(key === 13 && val){
                    $(this).val("");
                    rname = $(this).parents(".roomContainer").data("rName");
                    if(msg =_this.s.oVars.oTerminal.isMessageACommend(val)){
                        _this.s.oVars.oTerminal.analyseMessage(msg);
                    }else{
                        msg = "addMessage " + rname + " " + val;
                        _this.s.oVars.oTerminal.analyseMessage(msg);
                    }
                }
            });

            s.oBinds.tabs.off("click" ,__this._oBinds.leaveRoom).on("click" ,__this._oBinds.leaveRoom ,function(e){
                e.stopPropagation();
                var roomName = $(this).parent().parent().data("rName");
                _this.s.oVars.oTerminal.analyseMessage("leave " + roomName);
            });

            this._roomsReady = function(args){
                __this.roomsReady.notify({
                    "rooms" : args
                });
            };

            this._joinRoom = function(args){
                if(this._model._isLocked) return;
                __this.joinRoom.notify({
                    "joinRoom" : args
                });
            };

            this._leaveRoom = function(args){
                if(this._model._isLocked) return;
                __this.leaveRoom.notify({
                    "leaveRoom" : args
                });
            };

            this._addMessage = function(args){
                if(this._model._isLocked) return;
                __this.addMessage.notify({
                    "message" : args
                });
            };

            this._removeMessage = function(args){
                if(this._model._isLocked) return;
                __this.removeMessage.notify({
                    "message" : args
                });
            };

            this._setIsLocked = function(args){
                __this.setIsLocked.notify({
                    "isLocked" : args
                });
            };
        };

        this.ChatView.prototype = {

            fnRoomsReady : function(arg){

                var __this = this, i, j, member, room;

                for(i = 0 ; i < __this._model._rooms.length; i++){
                    room = __this._model._rooms[i];
                    if(room.type == "game")
                    {
                        continue;
                    }
                    if(!__this._model._rooms[i].init)
                    {
                        __this._model._rooms[i].init = new _this.s.oFns.Room(room);
                        _this.s.oBinds.tabs.append(__this._model._rooms[i].init.roomPanel);
                    }
                    __this._model._rooms[i].init.roomNav.appendTo(_this.s.oBinds.tabs.find('ul.tabsContainer'));

                    for( j = 0; j < room.members.length; j++ ){
                        member = room.members[j];
                        if(!__this._model._rooms[i].init.membersInit[member]){
                            __this._model._rooms[i].init.membersInit[member] = new _this.s.oFns.Members(member);
                        }
                        __this._model._rooms[i].init.membersInit[member].html.appendTo(__this._model._rooms[i].init.membersContainer);
                    }
                }
            },
            fnJoinRoom : function(arg){
                arg = arg.joinRoom;
                if(arg.nickName == _this.s.oVars.sNickName ){
                    $(_this.s.oBinds.tabs.find('ul.tabsContainer li.roomNav')).each(function(iIndex,oNode){
                        if($(oNode).data("rName") == arg.name){
                            _this.s.oBinds.tabs.tabs({ active: iIndex });
                            _this.s.oBinds.tabs.find(_this.s.oBinds.msg).focus();
                            return false;
                        }
                    })
                }
            },

            fnLeaveRoom : function(arg){
                //console.log(arg);
            },

            fnAddMessage : function(arg){
                var activeTabIndex,roomIndex, room, __this = this, msg = arg.message, msgIndex, roomName;
                msgIndex = __this._model.findMsgIndex(msg.id);
                __this._model._messages[msgIndex].init = new _this.s.oFns.Messages(msg);
                switch(msg.toType){
                    case "room":
                        roomIndex = _this.s.oFns.findRoomIndex(msg.to);
                        if(roomIndex > -1){
                            room = __this._model._rooms[roomIndex];
                            __this._model._messages[msgIndex].init.html.appendTo(room.init.msgContainer);
                            room.init.updateScroll();
                            this.notifyRoom(room);
                        }
                        break;
                    case "private":
                        activeTabIndex = _this.s.oVars.oTabs.tabs( "option", "active");
                        roomName = $(_this.s.oBinds.tabs.find('ul.tabsContainer li.roomNav')[activeTabIndex]).data("rName");
                        roomIndex = _this.s.oFns.findRoomIndex(roomName);
                        if(roomIndex > -1){
                            room = __this._model._rooms[roomIndex];
                            __this._model._messages[msgIndex].init.html.appendTo(room.init.msgContainer);
                            room.init.updateScroll();
                        }
                        break;

                    case "warning":
                        activeTabIndex = _this.s.oVars.oTabs.tabs( "option", "active");
                        roomName = $(_this.s.oBinds.tabs.find('ul.tabsContainer li.roomNav')[activeTabIndex]).data("rName");
                        roomIndex = _this.s.oFns.findRoomIndex(roomName);
                        if(roomIndex > -1){
                            room = __this._model._rooms[roomIndex];
                            __this._model._messages[msgIndex].init.html.appendTo(room.init.msgContainer);
                            room.init.updateScroll();
                        }
                        break;
                }
            },

            notifyRoom : function(room){
                var activeTabIndex, __this = this, roomName;
                activeTabIndex = _this.s.oVars.oTabs.tabs( "option", "active");
                roomName = $(_this.s.oBinds.tabs.find('ul.tabsContainer li.roomNav')[activeTabIndex]).data("rName");
                if(room.init.room.name !== roomName){
                    room.init.notifyChannel();
                    room.init.updateNotification();
                    _this.s.oBinds.notification.currentTime = 0;
                    _this.s.oBinds.notification.play();
                }
            },

            fnRemoveMessage : function(arg){
                var activeTabIndex, roomName,roomIndex,room, __this = this;
                activeTabIndex = _this.s.oVars.oTabs.tabs( "option", "active");
                roomName = $(_this.s.oBinds.tabs.find('ul.tabsContainer li.roomNav')[activeTabIndex]).data("rName");
                roomIndex = _this.s.oFns.findRoomIndex(roomName);
                if(roomIndex > -1){
                    room = __this._model._rooms[roomIndex];
                    room.init.updateScroll();
                }
            },

            destroy : function(){
                this.roomsReady = new _this.s.oFns.Event(this);
                this.joinRoom = new _this.s.oFns.Event(this);
                this.leaveRoom = new _this.s.oFns.Event(this);
                this.addMessage = new _this.s.oFns.Event(this);
                this.removeMessage = new _this.s.oFns.Event(this);
                this.setIsLocked = new _this.s.oFns.Event(this);
            }

        };

        this.ChatController = function(model, view){
            this._model = model;
            this._view = view;

            var __this = this;

            this._view.roomsReady.attach(function (sender, args) {
                __this.fnRoomsReady(args);
            });

            this._view.joinRoom.attach(function (sender, args) {
                __this.fnJoinRoom(args.joinRoom);
            });

            this._view.leaveRoom.attach(function (sender, args) {
                __this.fnLeaveRoom(args.leaveRoom);
            });

            this._view.addMessage.attach(function (sender, args) {
                __this.fnAddMessage(args.message);
            });

            this._view.removeMessage.attach(function (sender, args) {
                __this.fnRemoveMessage(args.message);
            });

            this._view.setIsLocked.attach(function (sender, args) {
                __this.setIsLocked(args.isLocked);
            });
        };

        this.ChatController.prototype = {

            fnRoomsReady : function(args){
                this._model.fnRoomsReady(args);
            },

            fnJoinRoom : function(args){
                this._model.fnJoinRoom(args);
            },

            fnLeaveRoom : function(args){
                this._model.fnLeaveRoom(args);
            },

            fnAddMessage : function(args){
                this._model.fnAddMessage(args);
            },
            fnRemoveMessage : function(args){
                this._model.fnRemoveMessage(args);
            },

            setIsLocked : function(args){
                this._model.setIsLocked(args);
            }
        };

        this._ChatModule = '';
        this._ChatView = '';
        this._ChatController = '';

        this.init = function(){
            _this._ChatModule = new _this.ChatModule();
            _this._ChatView = new _this.ChatView(_this._ChatModule);
            _this._ChatController = new _this.ChatController(_this._ChatModule, _this._ChatView);

            var extendRouterWith = {
                msg : function(args){
                    var action = "_" + args.action+"Message";
                    args.msg.date = Date.now();
                    _this._ChatView[action](args.msg);
                },

                roomDo : function(args){
                    var action = "_" + args.action+"Room";
                    _this._ChatView[action](args.msg);
                },

                updateRoomMembers : function(args){
                    for(var i = 0; i < args.msg.nickName.length; i++)
                    {
                        this.roomDo({
                            "action" : args.action,
                            "msg" : {
                                "name" : args.msg.name,
                                "type" : args.msg.type || "chat",
                                "nickName" : args.msg.nickName[i]
                            }
                        });
                    }

                }

            };
            _this.s.oVars.oRouter = $.extend(true,_this.s.oVars.oRouter, extendRouterWith);


            var extendTerminalWith = {
                w : function(args){
                    this.message(args, "add", "private");
                },

                whisper : function(args){
                    this.message(args, "add", "private");
                    return true;
                },

                addMessage : function(args){
                    this.message(args, "add", "room");
                    return true;
                },

                removeMessage : function(args){
                    this.message(args, "remove", "room");
                    return true;
                },

                message : function(args, action, toType){
                    var toEmit = {
                        "action" : action,
                        "msg" : {
                            "toType" : toType,
                            "to" : args[0],
                            "from" : _this.s.oVars.sNickName,
                            "date" : Date.now(),
                            "msg" : args.splice(1).join(" ")
                        }
                    };
                    _this.s.oVars.oSocket.emit('request', {"method": "msg", "msg" : toEmit});
                    _this._ChatView._addMessage(toEmit.msg);
                    return true;
                },

                join : function(args){
                    var toEmit;
                    toEmit = {
                        "action" : "join",
                        "msg" : {
                            "name" : args[0],
                            "type" : "chat",
                            "nickName" : _this.s.oVars.sNickName
                        }
                    };
                    _this._ChatView._joinRoom(toEmit.msg);
                    _this.s.oVars.oSocket.emit('request', {"method": "roomDo", "msg" : toEmit});
                    return true;
                },
                leave : function(args){
                    console.log("leaving channel client");
                    var toEmit;
                    toEmit = {
                        "action" : "leave",
                        "msg" : {
                            "name" : args[0],
                            "type" : "chat",
                            "nickName" : _this.s.oVars.sNickName
                        }
                    };
                    _this._ChatView._leaveRoom(toEmit.msg);
                    _this.s.oVars.oSocket.emit('request', {"method": "roomDo", "msg" : toEmit});
                    return true;
                },
                help : function(args){
                    console.log(args);
                }
            };
            _this.s.oVars.oTerminal = $.extend(true,_this.s.oVars.oTerminal, extendTerminalWith);
        };

        this.destroy = function(){
            setTimeout(function(){
                _this._ChatModule.destroy();
                _this._ChatView.destroy();
                _this._ChatModule = "";
                _this._ChatView = "";
                _this._ChatController = "";
            },1000)
        };

        this.resume = function(){

        };

        this.suspend = function(){

        };
    }
})(jQuery);