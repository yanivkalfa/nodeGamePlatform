/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .controller('loginController', [
        'Authorization',
        '$rootScope',
        '$state',
        '$cookieStore',
        'Api',
        'Notify',
        loginController
    ]);

function loginController(
    Authorization,
    $rootScope,
    $state,
    $cookieStore,
    Api,
    Notify
    ) {

    function LoginController(){
        this.api = Api.createNewApi(ngp.const.app.ajaxUrl);
        this.registerForm = {
            email : '',
            password : ''
        };
    }

    LoginController.prototype.login = _.bind(Authorization.login, Authorization, this.registerForm);

        /*function(){

        this.api.setMethod('post').setParams({
            "method" : 'login',
            "status" : 0,
            "success" : false,
            "data" : this.registerForm
        });

        this.api.doRequest().then(function(resp){
            if(resp.payload.success){
                $cookieStore.put('user', resp.payload.data);

                if(angular.isDefined($rootScope.ngp.returnToState))
                {
                    $state.go($rootScope.ngp.returnToState.name, $rootScope.ngp.returnToStateParams);
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
    };*/

    return new LoginController();
}