(function($){
    $.fn.StatusBar = function(s){
        var _this = this;
        this.s = s;
        this._StatusBarModule = '';
        this._StatusBarView = '';
        this._StatusBarController = '';
        this._RouterExtender = '';

        this.StatusBarModule = function(){
            this._isLoggedIn = false;
            this._nickName = "";
            this._gameList = _this.s.oVars.oOptions.chGlobal.gameList;
            this._totalMembers = 0;
            this._totalGames = 0;
            this._latency = 0;

            this.isLoggedIn = new _this.s.oFns.Event(this);
            this.nickNameReady = new _this.s.oFns.Event(this);
            this.gameListReady = new _this.s.oFns.Event(this);
            this.membersCountReady = new _this.s.oFns.Event(this);
            this.gamesCountReady = new _this.s.oFns.Event(this);
            this.latencyReady = new _this.s.oFns.Event(this);
        };

        this.StatusBarModule.prototype = {

            setNickName : function (data) {
                this._nickName = data;
                this.nickNameReady.notify({
                    "nickName" : data
                });
            },

            setGameList : function (data) {
                this._gameList = data;
                this.gameListReady.notify({
                    "gameList" : data
                });
            },

            setTotalMembers : function (data) {
                this._totalMembers = data;
                this.membersCountReady.notify({
                    "totalMembers" : data
                });
            },

            setTotalGames : function (data) {
                this.gamesCountReady.notify({
                    "totalGames" : data
                });
            },

            setLatency : function (data) {
                this._latency = data;
                this.latencyReady.notify({
                    "latency" : data
                });
            },

            connect : function () {
                if(!_this.s.oVars.oToken){
                    _this.s.oVars.oToken = $.fn.myCookie({cName: "oToken"});
                }
                _this.s.oVars.oSocket = io.connect(_this.s.oVars.oToken.token ? ('?token=' + _this.s.oVars.oToken.token) : '', { 'forceNew' : true });
                var updateConnectionStatus = this.updateConnectionStatus.bind(this);
                _this.s.oVars.oSocket.on('connect', updateConnectionStatus)
                    .on('disconnect', function(data){
                        _this.s.oVars.oLatencyCalculator.reset(true);
                    })
                    /*.on('connect_failed', updateConnectionStatus)
                     .on('authenticated', updateConnectionStatus)*/
                    .on('error',updateConnectionStatus);
            },

            updateConnectionStatus : function(){
                this._isLoggedIn = _this.s.oVars.oSocket.connected;
                this._nickName = _this.s.oVars.oToken.nickName;
                this.isLoggedIn.notify();
            },

            login : function(nickName){
                _this.s.oVars.oOptions.data = {
                    "method" : "login",
                    "post" : {"nickName" : nickName}
                };
                var data = _this.s.oFns.getData()();
                if(data.success){
                    _this.s.oVars.oToken = data.msg;
                }
                return data;
            },

            logout : function(){
                _this.s.oVars.oLatencyCalculator.reset(true);
                _this.s.oVars.oToken = false;
                $.fn.myCookie({cName : "oToken", del : true});
                //_this.s.oVars.oSocket.disconnect();
                location.reload();
            },

            destroy : function(){
                this._isLoggedIn = false;
                this._nickName = "";
                this._gameList = [];
                this._totalMembers = 0;
                this._totalGames = 0;
                this._latency = 0;

                this.isLoggedIn = new _this.s.oFns.Event(this);
                this.nickNameReady = new _this.s.oFns.Event(this);
                this.gameListReady = new _this.s.oFns.Event(this);
                this.membersCountReady = new _this.s.oFns.Event(this);
                this.gamesCountReady = new _this.s.oFns.Event(this);
                this.latencyReady = new _this.s.oFns.Event(this);
            }

        };

        this.StatusBarView = function(model){
            this._model = model;
            this._oBinds = _this.s.oBinds;

            this.tryingToConnect = new _this.s.oFns.Event(this);
            this.loginButtonClicked = new _this.s.oFns.Event(this);
            this.loginOutButtonClicked = new _this.s.oFns.Event(this);
            this.nickNameChanged = new _this.s.oFns.Event(this);
            this.gameListChanged = new _this.s.oFns.Event(this);
            this.membersCountChanged = new _this.s.oFns.Event(this);
            this.gamesCountChanged = new _this.s.oFns.Event(this);
            this.latencyChanged = new _this.s.oFns.Event(this);

            var __this = this;

            // attach model listeners
            this._model.isLoggedIn.attach(function () {
                __this.updateValues();
            });

            this._model.nickNameReady.attach(function (sender, args) {
                __this.updateNickName(args);
            });

            this._model.gameListReady.attach(function (sender, args) {
                __this.updateGameList(args);
            });

            this._model.membersCountReady.attach(function (sender, args) {
                __this.updateMembersCount(args);
            });

            this._model.gamesCountReady.attach(function (sender, args) {
                __this.updateGamesCount(args);
            });

            this._model.latencyReady.attach(function (sender, args) {
                __this.updateLatency(args);
            });

            // tryingToConnect will trigger connect function
            this._oBinds.document.ready(function () {
                __this.tryingToConnect.notify();
            });

            // attach listeners to HTML controls
            this._oBinds.submit.unbind('click').bind('click',function () {
                __this.loginButtonClicked.notify({
                    nickname :  __this._oBinds.nickname.val()
                });
            });

            this._oBinds.nickname.unbind('keyup').bind('keyup',function (e) {
                var key = e.keyCode || e.which;
                if(key === 13){
                    __this.loginButtonClicked.notify({
                        nickname : __this._oBinds.nickname.val()
                    });
                }
            });

            this._oBinds.logout.unbind('click').bind('click',function () {
                __this.loginOutButtonClicked.notify();
            });

            this._oBinds.statsDiv.unbind('mouseenter').bind('mouseenter',function (e) {
                __this._oBinds.stats.removeClass("displayNone");
            }).unbind('mouseleave').bind('mouseleave',function (e) {
                __this._oBinds.stats.addClass("displayNone");
            });

            this._oBinds.singlePlayer.unbind('mouseenter').bind('mouseenter',function (e) {
                __this._oBinds.singlePlayerGamesList.removeClass("displayNone");
            }).unbind('mouseleave').bind('mouseleave',function (e) {
                __this._oBinds.singlePlayerGamesList.addClass("displayNone");
            });

            this._oBinds.multiPlayer.unbind('mouseenter').bind('mouseenter',function (e) {
                __this._oBinds.multiPlayerGamesList.removeClass("displayNone");
            }).unbind('mouseleave').bind('mouseleave',function (e) {
                __this._oBinds.multiPlayerGamesList.addClass("displayNone");
            });

            this._oBinds.singlePlayerGamesList.off('click', _this.s.oBinds.queueSinglePlayerGame)
                .on('click', _this.s.oBinds.queueSinglePlayerGame,function (e) {
                    console.log("peiring something");
                });

            this._oBinds.multiPlayerGamesList.off('click', _this.s.oBinds.queueMultiPlayerGame)
                .on('click', _this.s.oBinds.queueMultiPlayerGame,function (e) {
                    console.log("peiring something");
                });

            this.changeNickName = function(args){
                __this.nickNameChanged.notify({
                    "nickname" : args
                });
            };

            this.changeGameList = function(args){
                __this.gameListChanged.notify({
                    "gameList" : args
                });
            };

            this.changeMembersCount = function(args){
                __this.membersCountChanged.notify({
                    "memberCount" : args
                });
            };

            this.changeGamesCount = function(args){
                __this.gamesCountChanged.notify({
                    "gamesCount" : args
                });
            };
            this.changeLatency = function(args){
                __this.latencyChanged.notify({
                    "latency" : args
                });
            }
        };

        this.StatusBarView.prototype = {

            updateValues : function(){
                var cgGlobal = _this.s.oVars.oOptions.chGlobal;
                if(this._model._isLoggedIn){
                    this.changeNickName(this._model._nickName);
                    this.changeGameList(cgGlobal.gameList);
                    this.changeMembersCount(cgGlobal.totalMembers);
                    this.changeGamesCount (cgGlobal.totalGames);

                    _this.s.oVars.sNickName = this._model._nickName;
                    _this.s.oVars.oScreen.set('logged');
                    $.fn.myCookie({cName : "oToken", cVal : _this.s.oVars.oToken});
                    _this.s.oVars.oRouter.init();
                    _this.s.oVars.oLatencyCalculator.init();
                }
                else
                {
                    _this.s.oVars.oScreen.set('home');
                }
            },

            updateNickName : function(args){
                this._oBinds.userNickName.text(this._model._nickName);
            },

            updateGameList : function(args){
                args = args.gameList;
                var __this = this, i, game;
                for(i = 0; i < args.length; i++){
                    game = args[i];
                    _this.s.oBinds.singlePlayerGamesList.append(_this.s.oFns.el.li.clone(true)
                        .attr("class", "queueSinglePlayerGame").data("gameName" , game.name).text(game.name));
                    _this.s.oBinds.multiPlayerGamesList.append(_this.s.oFns.el.li.clone(true)
                        .attr("class", "queueMultiPlayerGame").data("gameName" , game.name).text(game.name));
                }
            },

            updateMembersCount : function(args){
                this._oBinds.totalMembers.text(this._model._totalMembers);
            },

            updateGamesCount : function(args){
                this._oBinds.totalGames.text(this._model._totalGames);
            },

            updateLatency : function(args){
                this._oBinds.latency.text(this._model._latency + " ms");
            },

            destroy : function(){
                this.tryingToConnect = new _this.s.oFns.Event(this);
                this.loginButtonClicked = new _this.s.oFns.Event(this);
                this.loginOutButtonClicked = new _this.s.oFns.Event(this);
                this.nickNameChanged = new _this.s.oFns.Event(this);
                this.gameListChanged = new _this.s.oFns.Event(this);
                this.membersCountChanged = new _this.s.oFns.Event(this);
                this.gamesCountChanged = new _this.s.oFns.Event(this);
                this.latencyChanged = new _this.s.oFns.Event(this);
            }

        };

        this.StatusBarController = function(model, view){
            this._model = model;
            this._view = view;

            var __this = this;

            this._view.tryingToConnect.attach(function (sender, args) {
                __this.tryToConnect();
            });

            this._view.loginButtonClicked.attach(function (sender, args) {
                __this.login(args.nickname);
            });

            this._view.loginOutButtonClicked.attach(function (sender, args) {
                __this.logout();
            });

            this._view.nickNameChanged.attach(function (sender, args) {
                __this.changeNickName(args.nickname);
            });

            this._view.gameListChanged.attach(function (sender, args) {
                __this.changeGameList(args.gameList);
            });

            this._view.membersCountChanged.attach(function (sender, args) {
                __this.changeMemberCount(args.memberCount);
            });

            this._view.gamesCountChanged.attach(function (sender, args) {
                __this.changeGamesCount(args.gamesCount);
            });

            this._view.latencyChanged.attach(function (sender, args) {
                __this.changeLatency(args.latency);
            });
        };

        this.StatusBarController.prototype = {

            tryToConnect : function(){
                this._model.connect();
            },

            login : function(args){
                var result = this._model.login(args);
                if(result.success){
                    this._model.connect();
                }
                else
                {
                    alert(result.msg);
                }
            },

            logout : function(){
                this._model.logout();
                this._model.connect();
            },

            changeNickName : function(args){
                this._model.setNickName(args);
            },

            changeGameList : function(args){
                this._model.setGameList(args);
            },

            changeMemberCount : function(args){
                this._model.setTotalMembers(args);
            },

            changeGamesCount : function(args){
                this._model.setTotalGames(args);
            },

            changeLatency : function(args){
                this._model.setLatency(args);
            }
        };

        this.init = function(){
            _this._StatusBarModule = new _this.StatusBarModule();
            _this._StatusBarView = new _this.StatusBarView(_this._StatusBarModule);
            _this._StatusBarController = new _this.StatusBarController(_this._StatusBarModule, _this._StatusBarView);

            var extendRouterWith = {
                _view : _this._StatusBarView,
                _latencyCalculator : _this.s.oVars.oLatencyCalculator,

                changeNickName : function(args){
                    this._view.changeNickName(args);
                },

                changeGameList : function(args){
                    this._view.changeGameList(args);
                },

                changeMembersCount : function(args){
                    this._view.changeMembersCount(args);
                },

                changeGamesCount : function(args){
                    this._view.changeGamesCount(args);
                },

                ping : function(args){
                    this._latencyCalculator.calculateLatency(args);
                    this._view.changeLatency(_this.s.oVars.oLatencyCalculator.getLatency());
                }
            };
            _this.s.oVars.oRouter = $.extend(true,_this.s.oVars.oRouter, extendRouterWith);
        };

        this.destroy = function(){
            var view = _this._StatusBarView;
            view._oBinds.statsDiv.trigger("mouseleave");
            view._oBinds.statsDiv.unbind('mouseenter').unbind('mouseleave');
            view._oBinds.logout.trigger('click');
            view._oBinds.logout.unbind('click');
            setTimeout(function(){
                _this._StatusBarModule.destroy();
                _this._StatusBarView.destroy();
                _this._StatusBarModule = "";
                _this._StatusBarView = "";
                _this._StatusBarController = "";
            },1000)
        };

        this.resume = function(){

        };

        this.suspend = function(){

        };
    }
})(jQuery);