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

    function RegisterController(){
        this.api = apiFactory.createNewApi(ngp.const.app.ajaxUrl);
        this.registerForm = {
            username : '',
            email : '',
            password : '',
            rePassword : ''
        };
    }
    RegisterController.prototype.register = function(){
        this.api.setMethod('post').setParams({
            "method" : 'register',
            "status" : 0,
            "success" : false,
            "data" : this.registerForm
        });
        this.api.doRequest().then(function(resp){
            if(resp.payload.success){
                console.log('asdf');
                $state.go('login');
            }else{
                // notify
            }
        });
    };

    return new RegisterController();
}