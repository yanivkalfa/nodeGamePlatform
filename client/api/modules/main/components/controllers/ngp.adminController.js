/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .controller('adminController', [
        '$rootScope',
        '$scope',
        '$state',
        '$location',
        '$cookieStore',
        'Api',
        'User',
        'Notify',
        adminController
    ]);

function adminController(
    $rootScope,
    $scope,
    $state,
    $location,
    $cookieStore,
    Api,
    User,
    Notify
    ) {

    function AdminController(){
        this.api = Api.createNewApi(ngp.const.app.ajaxUrl);
        this.User = User.get();
        console.log(this.User);
    }

    AdminController.prototype.login = function(){
    };

    return new AdminController();
}