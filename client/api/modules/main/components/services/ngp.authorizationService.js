/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

angular.module(ngp.const.app.name)
    .factory('authorization', [
        '$rootScope',
        '$state',
        'User',
        authorizationFactory
    ]);

function authorizationFactory($rootScope, $state, User) {
    return {
        authorize: function() {
            return User.setUser()
                .then(function() {
                    var isAuthenticated = User.isAuthenticated();

                    if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !principal.isInAnyRole($rootScope.toState.data.roles)) {
                        if (isAuthenticated) $state.go('accessdenied'); // user is signed in but not authorized for desired state
                        else {
                            // user is not authenticated. stow the state they wanted before you
                            // send them to the signin state, so you can return them when you're done
                            $rootScope.returnToState = $rootScope.toState;
                            $rootScope.returnToStateParams = $rootScope.toStateParams;

                            // now, send them to the signin state so they can log in
                            $state.go('login');
                        }
                    }
                });
        }
    };
}