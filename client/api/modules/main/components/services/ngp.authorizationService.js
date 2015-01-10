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
            var user = User.setUser();
            console.log(user);

            if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !User.isInAnyRole($rootScope.toState.data.roles)) {
                console.log('a');
                if (User.isAuthenticated())
                {
                    $state.go('accessdenied');
                    console.log('b');
                }
                else
                {
                    console.log('c');
                    $rootScope.returnToState = $rootScope.toState;
                    $rootScope.returnToStateParams = $rootScope.toStateParams;

                    $state.go('login');
                }
            }
            console.log('d');
            return user;
            /*
            return User.setUser()
                .then(function() {
                    var isAuthenticated = User.isAuthenticated();

                    if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !principal.isInAnyRole($rootScope.toState.data.roles)) {
                        if (isAuthenticated) $state.go('accessdenied'); // user is signed in but not authorized for desired state
                        else {

                            $rootScope.returnToState = $rootScope.toState;
                            $rootScope.returnToStateParams = $rootScope.toStateParams;

                            $state.go('login');
                        }
                    }
                });
                */
        }
    };
}