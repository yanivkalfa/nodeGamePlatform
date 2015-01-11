/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .controller('loginController', [
        '$rootScope',
        '$state',
        '$cookieStore',
        'Api',
        'Notify',
        'WebSocket',
        loginController
    ]);

function loginController(
    $rootScope,
    $state,
    $cookieStore,
    Api,
    Notify,
    WebSocket
    ) {

    function LoginController(){
        this.api = Api.createNewApi(ngp.const.app.ajaxUrl);
        this.registerForm = {
            email : '',
            password : ''
        };
        console.log(WebSocket);
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

                if(angular.isDefined($rootScope.returnToState))
                {
                    $state.go($rootScope.returnToState.name, $rootScope.returnToStateParams);
                }
                else
                {
                    $state.go('admin');
                }
            }else{
                Notify.error('Login Failed: ' + resp.payload.data);
                $cookieStore.remove('user');
            }
        });
    };

    return new LoginController();
}