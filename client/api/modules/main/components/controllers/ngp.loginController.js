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
        loginController
    ]);

function loginController(
    $rootScope,
    $scope,
    $state,
    $location,
    $cookieStore,
    apiFactory,
    User
    ) {

    function LoginController(){
        this.api = apiFactory.createNewApi(ngp.const.app.ajaxUrl);
        this.registerForm = {
            email : '',
            password : ''
        };
        console.log($cookieStore.get('user'));
        console.log($rootScope.returnToState);
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
                $cookieStore.remove('user');
            }
        });
    };

    return new LoginController();
}