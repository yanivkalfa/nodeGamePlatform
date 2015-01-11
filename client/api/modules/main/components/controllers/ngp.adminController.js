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
        //'WebSocket',
        //'Latency',
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
    //WebSocket
    //Latency,
    ) {

    function AdminController(){
        var self = this;
        this.api = Api.createNewApi(ngp.const.app.ajaxUrl);
        this.User = User.get();
        this.bar = {
            stats : {
                hover : false,
                latency : 0
            }

        };

        console.log(WebSocket);
        console.log(WebSocketService);


        /*
        WebSocket.ping = function(data){
            Latency.calculateLatency(data);
            self.bar.stats.latency = Latency.getLatency();
            $scope.$apply();

        };*/

        /*
        WebSocket.then(function(webSocket){
            WebSocket = webSocket;

            WebSocket.ping = function(data){
                Latency.calculateLatency(data);
                self.bar.stats.latency = Latency.getLatency();
                $scope.$apply();

            };
        });

        */




    }

    AdminController.prototype.login = function(){
    };

    return new AdminController();
}