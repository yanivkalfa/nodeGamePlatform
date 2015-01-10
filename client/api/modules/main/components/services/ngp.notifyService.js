/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

angular.module(ngp.const.app.name)
    .factory('notify', [
        '$rootScope',
        '$state',
        'User',
        notifyFactory
    ]);

function notifyFactory($rootScope) {
    var _msg = ''
        , _show = false
        ;
    return {
        authorize: function() {
            return User.init()
                .then(function() {
                    var isAuthenticated = User.isAuthenticated();

                    if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !User.isInAnyRole($rootScope.toState.data.roles)) {
                        if (isAuthenticated) $state.go('accessdenied');
                        else {

                            $rootScope.returnToState = $rootScope.toState;
                            $rootScope.returnToStateParams = $rootScope.toStateParams;

                            $state.go('login');
                        }
                    }
                });
        }
    };
}