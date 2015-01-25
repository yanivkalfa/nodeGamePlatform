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
        this.Authorization = Authorization.getUser();
    }

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

    AdminController.prototype.roomSelected = function(){
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