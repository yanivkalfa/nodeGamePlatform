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

    var cfn = {fn: 'authenticateUser', f :User.authenticateUser,  args : '', execEvery : 3000, lastExec : false, ref : User};
    CronJobs.addCron(cfn);

    var cfn = {fn: 'authenticateUser', f :function(){console.log('aaaaa');},  args : '', execEvery : 1000, lastExec : false, ref : false};
    CronJobs.addCron(cfn);

    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {

        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;

        if (User.isResolved()) Authorization.authorize();
    });
}