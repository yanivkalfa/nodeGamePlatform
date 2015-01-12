/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name, ['ui.router', 'ngCookies'])
    .run([
        '$rootScope',
        'Authorization',
        'User',
        'CronJobs',
        runFactory
    ]);

function runFactory(
    $rootScope,
    Authorization,
    User,
    CronJobs
    ) {

    CronJobs.add({fn: 'authenticateUser', f : _.bind(User.authenticateUser, User),  args : '', execEvery : 3000, lastExec : false, ref : false});

    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {

        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;

        if (User.isResolved()) Authorization.authorize();
    });
}