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
        //'initChat',
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
    //initChat,
    Latency
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

        WebSocket.ping = function(data){
            Latency.calculateLatency(data);
            self.bar.stats.latency = Latency.getLatency();
            $scope.$apply();

        };

        $scope.tabs = [
            {
                id : '',
                title:'Dynamic Title 1',
                content:{
                    msg : [
                        {id:"01",from:"SomeOne", data: 1421700566413, formatDate :  moment(new Date(1421700566413)).format('HH:mm:ss'), content : "This is a message", toType: "private"},
                        {id:"02",from:"SomeOne", data: 1421700569382, formatDate :  moment(new Date(1421700569382)).format('HH:mm:ss'),content : "message 2" , toType: "room"},
                        {id:"03",from:"SomeOne", data: 1421700502938, formatDate :  moment(new Date(1421700502938)).format('HH:mm:ss'),content : "message 3" , toType: "room"}
                    ],
                    members:['SomeOne', 'someone2', 'someone3']
                }
            },
            {
                id : '',
                title:'Dynamic Title 2',
                content:{
                    msg : [
                        {id:"01",from:"SomeOne", data: 1421700566413, formatDate :  moment(new Date(1421700566413)).format('HH:mm:ss'), content : "This is a message", toType: "room"},
                        {id:"02",from:"SomeOne", data: 1421700569382, formatDate :  moment(new Date(1421700569382)).format('HH:mm:ss'),content : "message 2" , toType: "room"},
                        {id:"03",from:"SomeOne", data: 1421700502938, formatDate :  moment(new Date(1421700502938)).format('HH:mm:ss'),content : "message 3" , toType: "room"}
                    ],
                    members:['SomeOne', 'someone2', 'someone3']
                }
            }
        ];

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

    return new AdminController();
}