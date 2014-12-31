(function($){
    $.fn.app = function()
    {
        var _this = this;
        this.s =
        {
            oVars :
            {
                oSocket : false,
                oToken : false,
                oOptions : options,
                oRouter : false,
                latencyCalculator: false,
                oScreen : false,
                oTerminal : false,
                sNickName : "",
                oStatusBar : {},
                oChat : {},
                oRoomManagement : {},
                oTabs : false
            },
            oBinds :{
                document : $(document),
                loginWrap : $(".loginWrap"),
                statusBar : $(".statusBar"),
                tabs : $("#tabs"),
                loadingWrap : $(".loadingWrap"),
                gameWrap : $(".gameWrap"),
                leftSite : $(".leftSite"),
                rightSide : $(".rightSide"),
                nickname : $("#nickname"),
                submit : $("#submit"),
                logout : $(".logout"),
                msg : ".msg",
                submitMsg : ".submitMsg",
                latency : $("#latency"),
                serverTime : $(".serverTime"),
                userNickName : $("#userNickName"),
                totalMembers : $("#totalMembers"),
                totalGames : $("#totalGames"),
                statsDiv : $(".statsDiv"),
                stats : $(".stats"),
                singlePlayer : $(".singlePlayer"),
                singlePlayerGamesList : $(".singlePlayerGamesList"),
                queueSinglePlayerGame : '.queueSinglePlayerGame',
                multiPlayer : $(".multiPlayer"),
                multiPlayerGamesList : $(".multiPlayerGamesList"),
                queueMultiPlayerGame : '.queueMultiPlayerGame',
                notification : $("#notification")[0],
                leaveRoom : '.leaveRoom'
            },
            oFns : {
                init : function(){
                }
            }
        };

        this.s.oFns = $.extend(true, _this.s.oFns, $.fn.utilFunc(this.s));
        this.s.oVars.oRouter = new this.s.oFns.CallRouter();
        this.s.oVars.oLatencyCalculator = new this.s.oFns.LatencyCalculator();
        this.s.oVars.oScreen = new this.s.oFns.Screen();
        this.s.oVars.oTerminal = new this.s.oFns.Terminal();

    };


    $(document).ready(function()
    {
        var app =  new $.fn.app();

        app.s.oVars.oStatusBar  = new $.fn.StatusBar(app.s);
        app.s.oVars.oStatusBar.init();


        app.s.oVars.oChat  = new $.fn.Chat(app.s);
        app.s.oVars.oChat.init();

    });
})(jQuery);