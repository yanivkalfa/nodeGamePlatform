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

    function isNotAuthenticated(){
        $rootScope.returnToState = $rootScope.toState;
        $rootScope.returnToStateParams = $rootScope.toStateParams;

        return $state.go('login');
    }

    return {
        authorize: function() {
            return User.init()
                .then(function() {
                    var isAuthenticated = User.isAuthenticated();

                    if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !User.isInAnyRole($rootScope.toState.data.roles)) {
                        if (isAuthenticated) return $state.go('accessdenied');
                        else { return isNotAuthenticated();}
                    }
                }).catch(function(err){
                    if(err) return isNotAuthenticated();
                });
        }
    };
}