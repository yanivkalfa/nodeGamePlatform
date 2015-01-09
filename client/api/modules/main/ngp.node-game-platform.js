/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name, ['ui.router', 'ngCookies']).run(['$rootScope', '$state', '$stateParams', 'authorization', 'principal', runFactory]);

function runFactory($rootScope, $state, $stateParams, authorization, principal) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
        // track the state the user wants to go to; authorization service needs this
        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;
        // if the principal is resolved, do an authorization check immediately. otherwise,
        // it'll be done when the state it resolved.
        if (principal.isIdentityResolved()) authorization.authorize();
    });
}

/*
$cookieStore.put('aCookie', {a:5, b:10});
console.log($cookieStore.get('aCookie'));
$cookieStore.remove('aCookie');
*/