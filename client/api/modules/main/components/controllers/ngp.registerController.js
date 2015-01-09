/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .controller('registerController', [
        '$scope',
        '$state',
        '$location',
        'apiFactory',
        registerController
    ]);

function registerController($scope, $state, $location, apiFactory) {
    /*
    console.log($scope);
    console.log($state);
    console.log($location);
    console.log(apiFactory);*/

    function RegisterController(){
        this.api = apiFactory.createNewApi(ngp.const.app.ajaxUrl);
        this.registerForm = {
            username : false,
            password : false,
            rePassword : false
        };
    }
    RegisterController.prototype.register = function(){
        this.api.setMethod('post').setParams({
            "method" : 'register',
            "status" : 0,
            "success" : false,
            "data" : this.registerForm
        });
        this.api.doRequest().then(function(a){
            console.log(a);
        });
    };

    return new RegisterController();
}