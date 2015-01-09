/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .controller('loginController', [
        '$scope',
        '$state',
        '$location',
        'apiFactory',
        loginController
    ]);

function loginController($scope, $state, $location, apiFactory) {

    function LoginController(){
        this.api = apiFactory.createNewApi(ngp.const.app.ajaxUrl);
        this.registerForm = {
            email : '',
            password : ''
        };
    }
    LoginController.prototype.login = function(){
        this.api.setMethod('post').setParams({
            "method" : 'login',
            "status" : 0,
            "success" : false,
            "data" : this.registerForm
        });
        this.api.doRequest().then(function(data, statusCode){
            console.log(data);
            if(data.success){
                console.log(data , '- in' );
                $state.go('admin');
            }else{
                // notify
            }
        });
    };

    return new LoginController();
}