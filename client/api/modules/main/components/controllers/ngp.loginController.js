/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .controller('loginController', [
        '$scope',
        '$state',
        '$location',
        '$cookieStore',
        'apiFactory',
        loginController
    ]);

function loginController($scope, $state, $location, $cookieStore, apiFactory) {

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
        this.api.doRequest().then(function(resp){
            if(resp.payload.success){
                $cookieStore.put('user', resp.payload.data);
                $state.go('admin');
            }else{
                $cookieStore.remove('user');
            }
        });
    };

    return new LoginController();
}