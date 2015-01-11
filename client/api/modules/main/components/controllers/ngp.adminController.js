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
        'Latency',
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
    WebSocket,
    Latency
    ) {

    function AdminController(){
        var self = this;
        this.api = Api.createNewApi(ngp.const.app.ajaxUrl);
        this.User = User.get();
        this.bar = {
            statusHover : false
        };

        this.WebSocket = WebSocket.then(function(webSocket){
            self.WebSocket = webSocket;

            self.WebSocket.ping = function(data){
                Latency.calculateLatency(data);
                console.log(Latency.getLatency());
            };
        });




    }

    AdminController.prototype.login = function(){
    };

    return new AdminController();
}