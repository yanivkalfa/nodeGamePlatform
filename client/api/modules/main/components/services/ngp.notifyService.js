/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

angular.module(ngp.const.app.name)
    .factory('notify', [
        '$rootScope',
        notifyFactory
    ]);

function notifyFactory($rootScope) {
    console.log(arguments);
    $rootScope.notify = {
        show : false,
        class : 'notify-success',
        msg : ''
    };
    var options = {
            timeout : 3000,
            click : true
        },
        _reset = function(){

        },
        _notify = function(msg){
            $rootScope.notify.msg = msg;
            $rootScope.notify.show = true;
        };

    function NotifyFactory(){
        _notify(msg);
    }

    NotifyFactory.prototype = {
        success : function(msg) {
            $rootScope.notify.class = 'notify-success';
            _notify(msg);
        },
        error : function(msg) {
            $rootScope.notify.class = 'notify-failed';
            _notify(msg);
        }
    };

    return new NotifyFactory();
}