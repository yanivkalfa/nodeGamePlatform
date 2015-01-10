/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name, ['ui.router', 'ngCookies']).run(['$rootScope', '$state', '$stateParams', 'authorization', 'User', runFactory]);

function runFactory($rootScope, $state, $stateParams, authorization, User) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {

        $rootScope.notify = {
            show : true,
            class : 'success',
            msg : 'yaniv !'
        };
        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;

        if (User.isResolved()) authorization.authorize();
    });
}