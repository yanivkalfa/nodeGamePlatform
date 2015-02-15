(function(){


    /**
     *
     * @extends Game
     * @api public
     */
    function PongGame(opts){
        window.game.class.Game.apply(this, arguments);

        /**
         * is Game Ready ?
         *
         * @type {Boolean}
         * @api public
         */
        this.gameReady = false;


        /**
         * Holds $scope
         *
         * @type {$scope}
         * @api public
         */
        this.$scope = this.opts.$scope || undefined;


        /**
         * Holds $modal
         *
         * @type {$modal}
         * @api public
         */
        this.$modal = this.opts.$modal || undefined;


        /**
         * Holds Count down window
         *
         * @type {Object}
         * @api public
         */
        this.countDownWindow = undefined;


        /**
         * Holds count down
         *
         * @type {Number}
         * @api public
         */
        this.countDown = undefined;


        /**
         * Holds snapShots
         *
         * @type {Collection}
         * @api public
         */
        this.snapShots = undefined;


        /**
         * Holds inRouter
         *
         * @type {InRouter}
         * @api public
         */
        this.inRouter = undefined;


        /**
         * Holds outRouter
         *
         * @type {OutRouter}
         * @api public
         */
        this.outRouter = undefined;


        /**
         * Server's connection details
         *
         * @type {String}
         * @api public
         */
        this.serverDetails = this.opts.serverDetails || undefined;


        /**
         * Holds primus - socket
         *
         * @type {Primus}
         * @api public
         */
        this.primus = undefined;
    }

    PongGame.prototype = Object.create(window.game.class.Game.prototype);
    PongGame.prototype.constructor = PongGame;


    /**
     * Initiates all required classes
     *
     * @api public
     */
    PongGame.prototype.init = function(){
        var self = this;
        this.createGameContainer();
        this.entities = new window.game.class.List();
        this.snapShots = new window.game.class.Collection();
        this.mainLoop = new window.game.class.PongLoop(this, this.opts.cycle || {});
        this.players = new window.game.class.List();
        this.roles = new window.game.class.PongRoles(this);
        this.inRouter = new window.game.class.PongInRouter(this);
        this.outRouter = new window.game.class.PongOutRouter(this);

        this.loader = new window.game.class.PongLoader(this, function(){ self.connectToServer(); });
        this.scoreBoard = new window.game.class.PongScoreBoard(this);
        this.scoreBoard.init();
    };

    /**
     * create game container
     *
     * @api public
     */
    PongGame.prototype.createGameContainer = function(){
        var page, gameCanvas, gameContainer;
        gameContainer = document.getElementById('gameContainer');
        page = document.createElement("div");
        page.id = 'page';
        gameCanvas = document.createElement("span");
        gameCanvas.id = 'gameCanvas';
        page.appendChild(gameCanvas);
        gameContainer.appendChild(page);
        this.canvas.node = gameCanvas;
    };


    /**
     * Connect to Server - join player
     *
     * @api public
     */
    PongGame.prototype.connectToServer = function(){
        this.primus = Primus.connect(this.serverDetails);
        this.inRouter.init();
    };


    /**
     * star count down
     *
     * @api public
     */
    PongGame.prototype.startCountDown = function(){
        var self = this, interval;

        console.log('got here');
        this.countDownWindow = this.$modal.open({
            templateUrl: ngp.const.app.url + '/tpl/directives/gameCountDown.html',
            controller: 'gameCountDownController',
            controllerAs : 'gamecountdown',
            backdrop : 'static',
            resolve: {
                game: function () {
                    return self;
                }
            }
        });

        interval = setInterval(function(){
            self.countDown--;
            self.$scope.$apply();

            if(self.countDown <= 0){

                self.countDownWindow.close();
                self.gameReady = true;
                setTimeout(function(){
                    self.start();
                }, 100);
                clearInterval(interval);
            }
        }, 1000);

        this.countDownWindow.result.then(function (something) {

        }, function (something) {

        });
    };


    /**
     * On set primus/socket
     *
     * @api public
     */
    PongGame.prototype.setPrimus = function(primus){
        this.primus = primus;
    };


    /**
     * On key down
     *
     * @api public
     */
    PongGame.prototype.keydown = function(e){
        if(!this.gameReady) return false;
        this.keysPressed[e.which || e.keyCode] = true;
        this.outRouter.ks(this.keysPressed);
    };


    /**
     * on key up
     *
     * @api public
     */
    PongGame.prototype.keyup = function(e){
        if(!this.gameReady) return false;
        this.keysPressed[e.which || e.keyCode] = false;
        this.outRouter.ks(this.keysPressed);
    };


    /**
     * adding entity to entities Collection
     *
     * @override
     * @api public
     */
    PongGame.prototype.loadEntities = function(){
        var ball = new window.game.class.PongBall({id:'ball'},this);
        ball.init();
        this.entities.add(ball);
    };

    /**
     * Removing entity from entities Collection
     *
     * @override
     * @api public
     */
    PongGame.prototype.removeEntity = function(entity){
        this.entities.remove(entity.id);
    };

    /**
     * Join a player
     *
     * @api public
     */
    PongGame.prototype.joinPlayer = function(p){
        if(!p.local){
            p.position = new window.game.class.Point((this.canvas.width-40), (this.canvas.height/2) - 50)
        }
        var pongPlayer = new window.game.class.PongPlayer(p,this);
        pongPlayer.init();
        this.addPlayer(pongPlayer);
    };

    /**
     * adding Player to Players List
     *
     * @override
     * @api public
     */
    PongGame.prototype.addPlayer = function(player){
        this.players.add(player);
        this.entities.add(player);
    };


    /**
     * removing Player from Players List
     *
     * @override
     * @api public
     */
    PongGame.prototype.removePlayer = function(player){
        this.players.remove(player.id);
        this.entities.add(player.id);
    };

    /**
     * Loading game
     *
     * @api public
     */
    PongGame.prototype.load = function(){
        this.loader.load();
    };


    /**
     * Starting game
     *
     * @api public
     */
    PongGame.prototype.start = function(){
        this.mainLoop.start();
    };


    /**
     * Stopping game
     *
     * @api public
     */
    PongGame.prototype.stop = function(){
        this.mainLoop.stop();
    };


    /**
     * resetting game
     *
     * @api public
     */
    PongGame.prototype.reset = function(){};


    /**
     * killing game
     *
     * @override
     * @api public
     */
    PongGame.prototype.kill = function(){
        this.unBindKey();
        this.stop();
        this.primus.end();
        for(var prop in this){
            if(this.hasOwnProperty(prop)) delete this[prop];
        }
    };

    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.PongGame = PongGame;
})();