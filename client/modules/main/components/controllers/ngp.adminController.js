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
        'Terminal',
        'Chat',
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
    Terminal,
    Chat
    ) {

    function AdminController(){
        var self = this;
        this.api = Api.createNewApi(ngp.const.app.ajaxUrl);
        this.Authorization = Authorization.getUser();
        this.commandLine = '';
        this.games = [];
        this.init();
    }

    AdminController.prototype.init = function(){
        this.getGames();

    };

    AdminController.prototype.getGames = function(){
        var success,fail, options, self = this;

        success = function(resp){
            if(resp.payload.success){
               self.games = resp.payload.data;
                console.log(self.games);
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

    AdminController.prototype.queueMP = function(game){
        console.log(game);
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

        if(msg = Terminal.isMessageACommend(this.commandLine)){
            Terminal.analyseMessage(msg);
        }else{
            msg = "add " + rName + " " + this.commandLine;
            Terminal.analyseMessage(msg);
        }
        this.commandLine = '';
    };


    AdminController.prototype.roomSelected = function(rIndex){
        Chat.resetNotification(rIndex);
    };



    return new AdminController();
}