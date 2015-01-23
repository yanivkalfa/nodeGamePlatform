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
    WebSocket
    ) {

    function AdminController(){
        var self = this;
        this.api = Api.createNewApi(ngp.const.app.ajaxUrl);
        this.Authorization = Authorization.get();
    }

    AdminController.prototype.logout = function(){
        this.api.setMethod('post').setParams({
            "method" : 'logout',
            "status" : 0,
            "success" : false,
            "data" : {}
        });

        this.api.doRequest().then(function(resp){
            if(resp.payload.success){
                $cookieStore.remove('user');
                WebSocket.end();
                $state.go('login');
            }else{
                Notify.error('Login Failed: ' + resp.payload.data);
            }
        });
    };

    AdminController.prototype.channelSelected = function(){
        /*
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
        */
    };



    return new AdminController();
}