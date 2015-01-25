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
        loginController
    ]);

function loginController(
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
    LoginController.prototype.login = function(){
        var success,fail, options;

        console.log('logging');
        success = function(resp){
            if(resp.payload.success){
                $cookieStore.put('user', resp.payload.data);

                console.log('going to : ', $rootScope.ngp.returnToState);
                if(angular.isDefined($rootScope.ngp.returnToState))
                {
                    $state.go($rootScope.ngp.returnToState.name, $rootScope.ngp.returnToStateParams);
                }
                else
                {
                    console.log('going to : admin');
                    $state.go('admin');
                }
            }else{
                Notify.error('Login Failed: ' + resp.payload.data);
                $cookieStore.remove('user');
            }
        };

        fail = function(err){  Notify.error('There was some communication error: ' + err); };

        options = {
            method: 'post',
            url: ngp.const.app.ajaxUrl,
            data: {
                "method" : 'login',
                "status" : 0,
                "success" : false,
                "data" : this.registerForm
            }
        };

        this.api.doRequest(options).then(success).catch(fail);
    };

    return new LoginController();
}