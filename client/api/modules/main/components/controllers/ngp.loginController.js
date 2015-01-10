/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .controller('loginController', [
        '$rootScope',
        '$scope',
        '$state',
        '$location',
        '$cookieStore',
        'apiFactory',
        'User',
        'notify',
        loginController
    ]);

function loginController(
    $rootScope,
    $scope,
    $state,
    $location,
    $cookieStore,
    apiFactory,
    User,
    notify
    ) {

    function LoginController(){
        this.api = apiFactory.createNewApi(ngp.const.app.ajaxUrl);
        this.registerForm = {
            email : '',
            password : ''
        };

        //notify('aasda');
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
                // notify
                $cookieStore.remove('user');
            }
        });
    };

    return new LoginController();
}