/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name, ['ui.router', 'ngCookies'])
    .run([
        '$rootScope',
        'Authorization',
        'User',
        runFactory
    ]);

function runFactory(
    $rootScope,
    Authorization,
    User
    ) {

    console.log('asdfasdf');
    ////this.authenticateUser().then(function())

    //{fn: '', f :fun,  args : p, execEvery : 1000, lastExec : 102020202, ref : false}

    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {

        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;

        if (User.isResolved()) Authorization.authorize();
    });
}