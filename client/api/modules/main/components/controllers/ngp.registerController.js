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
        this.api = apiFactory.createNewApi(ngp.const.app.ajaxUrl, 'post', {item:51});
        this.api.doRequest().then(function(a){
            console.log(a);
        });

    }
    RegisterController.prototype.printSomething = function(){};

    return new RegisterController();
}