/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .controller('adminController', [
            '$rootScope',
            /*'$scope',
            '$state',
            '$location',
            '$cookieStore',*/
            'Api',
            'Authorization',
            'Notify',
            'ChatOut',
            'Chat',
            'Queues',
            'QueueOut',
            'Games',
            adminController
        ]);

    function adminController(
        $rootScope,
        /*$scope,
        $state,
        $location,
        $cookieStore,*/
        Api,
        Authorization,
        Notify,
        ChatOut,
        Chat,
        Queues,
        QueueOut,
        Games
        ) {

        function AdminController(){
            this.api = Api.createNewApi(ngp.const.app.ajaxUrl);
            this.Authorization = Authorization.getUser();
            this.commandLine = '';
            this.games = Games.get();
            this.imgUrl = ngp.const.app.imgUrl;

        }

        AdminController.prototype.queueMP = function(g){
            var self = this
                , queue = {
                    game : g.id,
                    user : {id : self.Authorization.id, username : self.Authorization.username},
                    name:g.queueName,
                    userCount : g.userCount
                }
                ,qId
                ;

            if(g.isBusy()) return Notify.error('Your previous action is still in progress');
            g.setBusy(true);
            if(!g.isQueued()) QueueOut.join(queue);
            else {
                qId = g.getQueue();
                queue = Queues.get(qId);
                QueueOut.leave({ id : queue.id, name : queue.name});
            }
        };

        /*


        AdminController.prototype.queueSP = function(game){
            console.log(game);
        };
        */

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
})();

