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
        'User',
        'Notify',
        adminController
    ]);

function adminController(
    $rootScope,
    $scope,
    $state,
    $location,
    $cookieStore,
    Api,
    User,
    Notify
    ) {

    function AdminController(){
        var self = this;
        this.api = Api.createNewApi(ngp.const.app.ajaxUrl);
        this.User = User.get();
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

    AdminController.prototype.channelSelected = function(){};



    return new AdminController();
}