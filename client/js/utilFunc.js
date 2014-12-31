(function($){
    $.fn.utilFunc = function(s){
        var _this = this;
        this.el = {
            a : $('<a>'),
            ul : $('<ul>'),
            li : $('<li>'),
            div : $('<div>'),
            span : $('<span>'),
            button : $('<button></button>'),
            input : $('<input>'),
            img : $('<img>'),
            table : $('<table>'),
            tr : $('<tr>'),
            td : $('<td>'),
            th : $('<th>'),
            tbody : $('<tbody>'),
            thead : $('<thead>'),
            tfoot : $('<tfoot>')
        };

        this.getData = function(){
            var getData = {};
            var setData = function(data) {
                getData = data;
            };

            return function(){
                $.ajax({
                    url: s.oVars.oOptions.ajaxURL,
                    type: "post",
                    async: false,
                    dataType:'json',
                    contentType: 'application/json',
                    data:JSON.stringify(s.oVars.oOptions.data),
                    success: function (data) {
                        setData(data);
                    },
                    error : function (data) {
                        setData(data);
                    }
                });
                return getData;
            }
        };

        this.Event = function (sender) {
            this._sender = sender;
            this._listeners = [];
        };

        this.Event.prototype = {
            attach : function (listener) {
                this._listeners.push(listener);
            },
            notify : function (args) {
                var index;

                for (index = 0; index < this._listeners.length; index += 1) {
                    this._listeners[index](this._sender, args);
                }
            }
        };

        this.findRoomIndex = function(rName){
            var rooms = s.oVars.oOptions.chGlobal.rooms, _this = this, toReturn = -1, i, room;
            for(i = 0; i < rooms.length; i++){
                room = rooms[i];
                if(room.name == rName){
                    toReturn = i;
                    break;
                }
            }

            return toReturn;
        };

        this.sortToLower = function(order) {
            if(order === "DESC"){
                return function (a,b) {
                    return (a.toLowerCase() < b.toLowerCase()) ? 1 : (a.toLowerCase() > b.toLowerCase()) ? -1 : 0;
                }
            }else{
                return function (a,b) {
                    return (a.toLowerCase() > b.toLowerCase()) ? 1 : (a.toLowerCase() > b.toLowerCase()) ? -1 : 0;
                }
            }
        };

        this.multiSortStrings = function(property, order) {
            if(order === "DESC"){
                return function (a,b) {
                    return (a[property].toLowerCase() < b[property].toLowerCase()) ? 1 : (a[property].toLowerCase() > b[property].toLowerCase()) ? -1 : 0;
                }
            }else{
                return function (a,b) {
                    return (a[property].toLowerCase() > b[property].toLowerCase()) ? 1 : (a[property].toLowerCase() > b[property].toLowerCase()) ? -1 : 0;
                }
            }
        };

        this.multiSort = function(property, order) {
            if(order === "DESC"){
                return function (a,b) {
                    return (a[property] < b[property]) ? 1 : (a[property] > b[property]) ? -1 : 0;
                }
            }else{
                return function (a,b) {
                    return (a[property] > b[property]) ? 1 : (a[property] > b[property]) ? -1 : 0;
                }
            }
        };
        //dashArr.sort(s.oFns.multiSort("name", "DESC"));

        this.CallRouter = function(){
            var __this = this;

            this.init = function(){
                s.oVars.oSocket.on('response', function(resp){
                    __this[resp.method](resp.msg);

                });
            };
        };

        this.Screen = function(){
            var __this = this;

            this.tabsInit = false;

            this.screens = {
                home : function(){
                    s.oBinds.loginWrap.removeClass("displayNone");
                },
                logged : function(){
                    s.oBinds.statusBar.removeClass("displayNone");
                    if(!__this.tabsInit){
                        s.oVars.oTabs = s.oBinds.tabs.tabs({
                            activate: function( event, ui ) {
                                var roomIndex, roomInit;
                                roomIndex = _this.findRoomIndex(ui.newTab.data("rName"));

                                if(roomIndex > -1){
                                    roomInit = s.oVars.oChat._ChatModule._rooms[roomIndex].init;
                                    roomInit.resetNotification();
                                    roomInit.updateNotification();

                                }
                            }
                        });
                        __this.tabsInit = true;
                    }
                    s.oBinds.tabs.removeClass("displayNone");
                },
                loading : function(){
                    s.oBinds.loadingWrap.removeClass("displayNone");
                },
                inGame : function(){
                    s.oBinds.gameWrap.removeClass("displayNone");
                }
            };

            this.clear = function(){
                s.oBinds.loginWrap.removeClass("displayNone").addClass("displayNone");
                s.oBinds.loadingWrap.removeClass("displayNone").addClass("displayNone");
                s.oBinds.gameWrap.removeClass("displayNone").addClass("displayNone");
                s.oBinds.statusBar.removeClass("displayNone").addClass("displayNone");
                if(__this.tabsInit){
                    s.oBinds.tabs.tabs("destroy");
                    __this.tabsInit = false;
                }

                s.oBinds.tabs.removeClass("displayNone").addClass("displayNone");
            };

            this.set = function(screen){
                __this.clear();
                __this.screens[screen]();
            }
        };

        this.Terminal = function(){
            var __this = this;
            this._commend = "";
            this._arguments = "";

            this.isMessageACommend = function(msg){
                return (msg.slice(0, 1) == "/") ? msg.slice(1) : false ;
            };

            this.analyseMessage = function(msg){
                var temp = msg.split(" ");
                __this._commend = temp[0];
                __this._arguments = temp.splice(1);

                if(typeof __this[__this._commend] === 'function'){
                    return __this[__this._commend](__this._arguments);
                }

                return {"success":false,"msg":"4004", errorIn: __this._commend}
            };
        };

        //w [name] [message] /whisper [name] [message] /join channelName /leave channelName

        this.LatencyCalculator = function(){
            var __this = this;
            this._router = s.oVars.oRouter;
            this._pingSent = 0;
            this._pingreturn = 0;
            this._latency = 0;
            this._accomulativeLatency = 0;
            this._rounds = 0;
            this.timeElapsed = 0;

            this.cycleTime = 60*60*1000;
            this.pingEvery = 30*1000;
            this.pingInterval = false;

            this.init = function(){
                this.reset();
                this.pingServer();
                clearInterval(this.pingInterval);
                this.pingInterval = setInterval(__this.pingServer,__this.pingEvery);
            };

            this.pingServer = function(){
                __this._pingSent = Date.now();
                s.oVars.oSocket.emit('request', {"method": "ping", "msg":"ping"});

                if(__this.cycleTime <= __this.timeElapsed){
                    __this.init();
                }
                __this.timeElapsed += __this.pingEvery;
            };

            this.reset = function(kill){
                this._pingSent = 0;
                this._pingreturn = 0;
                this._accomulativeLatency = 0;
                this._rounds = 1;
                this.timeElapsed = 0;
                if(kill){
                    this._latency = 0;
                    this._rounds = 0;
                    clearInterval(this.pingInterval);
                }
            };

            this.calculateLatency = function(args){
                __this._rounds++;
                __this._pingreturn = Date.now();
                __this._accomulativeLatency += __this._pingreturn - __this._pingSent;
                __this._latency = __this._accomulativeLatency/__this._rounds;
            };

            this.getLatency = function(){
              return Math.round(__this._latency);
            };
        };

        this.MessageRouter = function(){

        };

        this.Messages = function(msg){
            var __this = this;
            this.msg = msg;
            this.html = _this.el.li.clone(true);

            this.createMessage = function(){
                var child;
                child = _this.el.span.clone(true).addClass("msgDate msgSegment").text("["+ moment(new Date(__this.msg.date)).format('HH:mm:ss') +"]");
                __this.html.append(child);
                child = _this.el.span.clone(true).addClass("msgFrom msgSegment").text("<"+__this.msg.from+">");
                __this.html.append(child);
                child = _this.el.span.clone(true).addClass("msgContent msgSegment").text(__this.msg.msg);
                __this.html.append(child);

                switch(this.msg.toType){
                    case "private":
                        this.html.css("color", "purple");
                        break;
                    case "room":
                        this.html.css("color", "black");
                        break;
                    case "warning":
                        this.html.css("color", "red");
                        break;
                }
            };

            this.destroy = function(){
                this.html.remove();
                this.html = null;
            };

            this.createMessage();
        };

        this.Members = function(member){
            var __this = this;
            this.member = member;
            this.html = _this.el.li.clone(true);

            this.createMember = function(){
                this.html.text(member).attr("class" , "member_" + member).data("member", member);
            };

            this.destroy = function(){
                this.html.remove();
                this.html = null;
            };

            this.createMember();
        };

        this.Room = function(room){
            var __this = this;
            this.room = room;
            this.roomNav = _this.el.li.clone(true);
            this.roomPanel = _this.el.div.clone(true);
            this.membersInit = {};
            this.msgContainer = "";
            this.membersContainer = "";
            this.notification = 0;

            this.scrollFlag = true;


            this.init  = function(){
                var a = _this.el.a.clone(true).attr("href","#tabs-" + __this.room.name)
                    .append(__this.room.name, _this.el.span.clone(true).attr({
                        "class" : "roomNotificationPlaceHolder"
                    }),(__this.room.name != "lobby") ? _this.el.span.clone(true).attr({
                        "class" : "leaveRoom"
                    }).text("X") : "");
                this.roomNav.append(a).addClass("roomNav").data("rName",__this.room.name);
                this.roomPanel.attr("id", "tabs-" + __this.room.name).addClass("roomContainer").data("rName",__this.room.name);
                this.createRoomHtml();
                this.bindControls();
            };

            this.bindControls = function(){
                __this.roomPanel.find('.msgWrap').off('scroll').on('scroll', function(){
                    __this.scrollFlag = $(this).scrollTop()+$(this).height() == this.scrollHeight;
                });

            };

            this.scrollBottom = function(){
                __this.roomPanel.find('.msgWrap').scrollTop(__this.roomPanel.find('.msgWrap')[0].scrollHeight);
            };

            this.updateScroll = function(){
                if(__this.scrollFlag){
                    __this.scrollBottom();
                }
            };

            this.createRoomHtml = function(){
                var parent, child;
                parent = _this.el.div.clone(true).attr("class","leftSite");
                child = _this.el.div.clone(true).attr("class","msgWrap");
                this.msgContainer = _this.el.ul.clone(true);
                child.append(this.msgContainer);
                parent.append(child);

                child = _this.el.div.clone(true).attr("class","inputWrap");
                child.append(_this.el.input.clone(true).attr({
                    "class" : "msg",
                    "name" : "msg",
                    "placeholder" : "Enter a message",
                    "type"  : "text"
                }));

                child.append(_this.el.button.clone(true).attr({
                    "class" : "submitMsg",
                    "name" : "submitMsg"
                }).text("Send"));
                parent.append(child);
                this.roomPanel.append(parent);

                parent = _this.el.div.clone(true).attr("class","rightSide");
                this.membersContainer = _this.el.ul.clone(true);
                parent.append(this.membersContainer);
                this.roomPanel.append(parent);

                parent = _this.el.div.clone(true).attr("class","clearFix");
                this.roomPanel.append(parent);
            };

            this.notifyChannel = function(){
                this.notification++;
            };

            this.resetNotification = function(){
                this.notification = 0;
            };

            this.updateNotification = function(){
                this.roomNav.find('.roomNotificationPlaceHolder').html('');
                if(this.notification > 0){
                    this.roomNav.find('.roomNotificationPlaceHolder').append(_this.el.span.clone(true).attr({
                        "class" : "roomNotification"
                    }).text('(' + this.notification + ')'));
                }
            };
            this.destroy = function(){
                this.room = null;
                this.roomNav.remove();
                this.roomNav = null;
                this.roomPanel.remove();
                this.roomPanel = null;
                this.msgContainer.remove();
                this.msgContainer = null;
                this.membersContainer.remove();
                this.membersContainer = null;
            };

            this.init();
        };

        return this;
    }
})(jQuery);