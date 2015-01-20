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
        $rootScope.ngp.returnToState = $rootScope.ngp.toState;
        $rootScope.ngp.returnToStateParams = $rootScope.ngp.toStateParams;

        return $state.go('login');
    }

    return {
        authorize: function() {
            return User.init()
                .then(function() {
                    var isAuthenticated = User.isAuthenticated();

                    if ($rootScope.ngp.toState.data.roles && $rootScope.ngp.toState.data.roles.length > 0 && !User.isInAnyRole($rootScope.ngp.toState.data.roles)) {
                        if (isAuthenticated) return $state.go('accessdenied');
                        else { return isNotAuthenticated();}
                    }
                }).catch(function(err){
                    if(err) return isNotAuthenticated();
                });
        }
    };
}