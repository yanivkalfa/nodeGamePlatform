/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name, ['ui.router', 'ngCookies', 'ui.bootstrap'])
    .run([
        '$rootScope',
        '$templateCache',
        'Authorization',
        'CronJobs',
        runFactory
    ]);

function runFactory(
    $rootScope,
    $templateCache,
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


    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {

        $rootScope.ngp.toState = toState;
        $rootScope.ngp.toStateParams = toStateParams;

        if (toState.name == 'admin' || toState.parent == 'admin' && !Authorization.isSet()) {
            console.log('!isSet');
            event.preventDefault();
            Authorization.notAuthorized();
        }/*else if(toState.name == 'admin' || toState.parent == 'admin'){
            console.log('!isSet');
            event.preventDefault();
            Authorization.notAuthorized();
        }*/
    });
}