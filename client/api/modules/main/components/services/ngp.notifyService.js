/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

angular.module(ngp.const.app.name)
    .factory('notify', [
        '$rootScope',
        notifyFactory
    ]);

function notifyFactory($rootScope) {


    function NotifyFactory(){
        this.options = {
            timeout : 3000
        };

        this.show = false;
        this.class = 'notify-success';
        this.msg = '';
    }

    NotifyFactory.prototype =  {

        reset : function() {
            this.msg = '';
            this.class = 'notify-success';
            this.show = false;
            console.log(this);
        },

        success : function(msg) {
            this.class = 'notify-success';
            this.message(msg);
        },
        error : function(msg) {
            this.class = 'notify-failed';
            this.message(msg);
        },
        warning : function(msg) {
            this.class = 'notify-warning';
            this.message(msg);
        },
        message : function(msg) {
            var _self = this;
            this.msg = msg;
            this.show = true;
            if(this.options.timeout){
                setTimeout(function(){
                    _self.reset();
                    $rootScope.$apply();
                   // _.bind(_self.reset, $rootScope.notify)
                },_self.options.timeout);
            }
        }
    };

    var notify = new NotifyFactory();

    $rootScope.notify = notify;

    return notify;
}