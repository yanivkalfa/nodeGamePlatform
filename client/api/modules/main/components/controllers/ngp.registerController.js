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
    /*
    console.log($scope);
    console.log($state);
    console.log($location);
    console.log(apiFactory);*/

    function RegisterController(){
        this.api = apiFactory.createNewApi(ngp.const.app.ajaxUrl, 'get');
        this.api.doRequest().then(function(a,b,c,d,e){
            console.log(a,b,c,d,e);
        });

    }
    RegisterController.prototype.printSomething = function(){};

    return new RegisterController();
}