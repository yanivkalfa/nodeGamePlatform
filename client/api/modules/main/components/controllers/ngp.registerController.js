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
    console.log($scope);
    console.log($state);
    console.log($location);
    console.log(apiFactory);

    function RegisterController(){
        this.something = 'something';
    }
    RegisterController.prototype.printSomething = function(){
        console.log(this.something, this);
    };

    return new RegisterController();
}