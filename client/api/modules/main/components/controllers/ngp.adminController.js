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
        'apiFactory',
        'User',
        'notify',
        adminController
    ]);

function adminController(
    $rootScope,
    $scope,
    $state,
    $location,
    $cookieStore,
    apiFactory,
    User,
    notify
    ) {

    function AdminController(){
        this.api = apiFactory.createNewApi(ngp.const.app.ajaxUrl);
        User.init();
        this.User = User.get();

    }

    AdminController.prototype.login = function(){
    };

    return new AdminController();
}