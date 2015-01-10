/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .controller('registerController', [
        '$scope',
        '$state',
        '$location',
        'apiFactory',
        'notify',
        registerController
    ]);

function registerController($scope, $state, $location, apiFactory, notify) {

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
                $state.go('login');
            }else{
                notify.error('registration Failed :', resp.payload.data);
            }
        });
    };

    return new RegisterController();
}