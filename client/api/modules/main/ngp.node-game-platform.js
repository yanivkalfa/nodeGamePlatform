/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name, ['ui.router', 'ngCookies', 'ui.bootstrap'])
    .run([
        '$rootScope',
        'Authorization',
        'CronJobs',
        runFactory
    ]);

function runFactory(
    $rootScope,
    Authorization,
    CronJobs
    ) {
    $rootScope.ngp = {
        bar : {
            stats : {
                hover : false,
                latency : 0
            }
        },
        rooms : []
    };

    CronJobs.add({fn: 'authenticate', f : '',  args : '', execEvery : 300000, lastExec : Date.now() + 120000, ref : Authorization});

    console.log("cookies:",document.cookie);


    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {

        $rootScope.ngp.toState = toState;
        $rootScope.ngp.toStateParams = toStateParams;

        if (Authorization.isSet()) {
            Authorization.init()
                .then(_.bind(Authorization.authorized, Authorization))
                .catch(_.bind(Authorization.notAuthorized, Authorization));
        }
    });
}