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
    User,
    Notify,
    WebSocket
    ) {

    function AdminController(){
        this.api = Api.createNewApi(ngp.const.app.ajaxUrl);
        this.User = User.get();
        console.log(this.User);

        console.log(WebSocket);
        WebSocket.prototype.newa = function(data){
            console.log('a');
        };

        this.WebSocket = new WebSocket();


    }

    AdminController.prototype.login = function(){
    };

    return new AdminController();
}