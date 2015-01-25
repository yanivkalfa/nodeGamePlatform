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
        'Authorization',
        loginController
    ]);

function loginController(
    $rootScope,
    $state,
    $cookieStore,
    Api,
    Notify,
    Authorization
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

        success = function(resp){
            if(resp.payload.success){
                $cookieStore.put('user', resp.payload.data);

                if(angular.isDefined($rootScope.ngp.returnToState))
                {
                    Authorization.init()
                        .then(function(user){
                            console.log(user)
                            //_.bind(Authorization.authorized, Authorization)

                            if(Authorization.authorized(user))
                                $state.go($rootScope.ngp.returnToState.name, $rootScope.ngp.returnToStateParams);
                        })
                        .catch(_.bind(Authorization.notAuthorized, Authorization));
                    //document.location.href = $state.href($rootScope.ngp.returnToState.name, $rootScope.ngp.returnToStateParams, {absolute: true});

                }
                else
                {
                    Authorization.init()
                        .then(function(user){
                            //_.bind(Authorization.authorized, Authorization)
                            console.log(user)
                            if(Authorization.authorized(user))
                                $state.go('admin');
                        })
                        .catch(_.bind(Authorization.notAuthorized, Authorization));
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