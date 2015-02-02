/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .controller('adminController', [
        '$rootScope',
        '$scope',
        '$state',
        '$location',
        '$cookieStore',
        'Api',
        'Authorization',
        'Notify',
        'ChatOut',
        'Chat',
        'Queues',
        'QueueOut',
        'RoutQueue',
        'WebSocket',
        adminController
    ]);

function adminController(
    $rootScope,
    $scope,
    $state,
    $location,
    $cookieStore,
    Api,
    Authorization,
    Notify,
    ChatOut,
    Chat,
    Queues,
    QueueOut,
    RoutQueue,
    WebSocket
    ) {

    function AdminController(){
        var self = this;
        this.api = Api.createNewApi(ngp.const.app.ajaxUrl);
        this.Authorization = Authorization.getUser();
        this.commandLine = '';
        this.games = [];
        this.imgUrl = ngp.const.app.imgUrl;
        this.RoutQueue = new RoutQueue();
        WebSocket.queue = function(msg){
            self.RoutQueue.rout(msg);
        };
        this.init();

    }

    AdminController.prototype.init = function(){
        this.getGames();
    };
/*
    AdminController.prototype.inQueue = function(game){
        game.inQueue = true;
    };

    AdminController.prototype.outOfQueue = function(game){
        game.inQueue = false;
    };

    AdminController.prototype.setSearchImg = function(game){
        game.img = 'queueSearching.gif';
    };*/

    AdminController.prototype.setSearchImg = function(game){
        game.img = 'queueSearching.gif';
    };

    AdminController.prototype.setGameImg = function(game){
        game.img = game.name + '.png';
    };

    AdminController.prototype.prepareGames = function(games){
        var self = this;
        _(games).forEach(function(game){
            game.img = game.name + '.png';
        });

        this.games = games;
    };

    AdminController.prototype.getGames = function(){
        var success,fail, options, self = this;

        success = function(resp){
            if(resp.payload.success){
                self.prepareGames(resp.payload.data)
            }else{
                Notify.error('Error: ' + resp.payload.data);
            }
        };

        fail = function(err){  Notify.error('Error: ' + err); };

        options = {
            method: 'post',
            url: ngp.const.app.ajaxUrl,
            data: {
                "method" : 'getGames',
                "status" : 0,
                "success" : false,
                "data" : ''
            }
        };

        this.api.doRequest(options).then(success).catch(fail);
    };

    AdminController.prototype.queueMP = function(g){
        var self = this
            , queue = {
                users : {id : self.Authorization.id, username : self.Authorization.username},
                name:g.queueName,
                end : function(id){
                    self.setGameImg(g);
                },
                ready : function(){}
                ,
                timedOut : function(){}
            }
            , analysed
            ;

        queue = Queues.add(queue);
        console.log('got here: a');
        this.setSearchImg(g);

        analysed = QueueOut.analyseMessage("join " + queue.id);

        console.log('got here: end');
        if(analysed.success){
            Notify.success('Queued for: ', queue.name);
        }else{
            Notify.error(analysed.msg);
        }
    };

    AdminController.prototype.queueSP = function(game){
        console.log(game);
    };

    AdminController.prototype.logout = function(){
        var success,fail, options;

        success = function(resp){
            if(resp.payload.success){
                Authorization.logout();
            }else{
                Notify.error('Logout Failed: ' + resp.payload.data);
            }
        };

        fail = function(err){  Notify.error('There was some communication error: ' + err); };

        options = {
            method: 'post',
            url: ngp.const.app.ajaxUrl,
            data: {
                "method" : 'logout',
                "status" : 0,
                "success" : false,
                "data" : {}
            }
        };

        this.api.doRequest(options).then(success).catch(fail);
    };

    AdminController.prototype.msgInput = function(e){
        var key = e.keyCode || e.which;
        if(key === 13 && this.commandLine) this.sendMessage();
    };

    AdminController.prototype.msgButton = function(){
        if(this.commandLine) this.sendMessage();
    };

    AdminController.prototype.sendMessage = function(){
        var rIndex = Chat.getActiveRoom()
            , rName = $rootScope.ngp.rooms[rIndex].id
            , msg
            ;

        if(msg = ChatOut.isMessageACommend(this.commandLine)){
            ChatOut.analyseMessage(msg);
        }else{
            msg = "add " + rName + " " + this.commandLine;
            ChatOut.analyseMessage(msg);
        }
        this.commandLine = '';
    };


    AdminController.prototype.roomSelected = function(rIndex){
        Chat.resetNotification(rIndex);
    };



    return new AdminController();
}