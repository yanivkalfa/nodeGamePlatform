/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

angular.module(ngp.const.app.name)
    .factory('Authorization', [
        '$rootScope',
        '$state',
        'User',
        authorizationFactory
    ]);

function authorizationFactory(
    $rootScope,
    $state,
    User
    ) {

    return {
        authorize: function() {
            return User.init()
                .then(function() {
                    var isAuthenticated = User.isAuthenticated();
                    console.log(isAuthenticated);

                    if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !User.isInAnyRole($rootScope.toState.data.roles)) {
                        if (isAuthenticated) $state.go('accessdenied');
                        else {

                            $rootScope.returnToState = $rootScope.toState;
                            $rootScope.returnToStateParams = $rootScope.toStateParams;

                            $state.go('login');
                        }
                    }
                }).catch(function(a){
                    console.log('aa');
                });
        }
    };
}