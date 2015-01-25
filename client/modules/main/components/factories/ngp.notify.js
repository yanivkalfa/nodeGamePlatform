/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

angular.module(ngp.const.app.name)
    .factory('Notify', [
        '$rootScope',
        Notify
    ]);

function Notify($rootScope) {


    function NotifyFactory(){
        this.options = { timeout : 5000 };
        this.reset();
    }

    NotifyFactory.prototype =  {

        reset : function() {
            this.msg = '';
            this.class = 'notify-success';
            this.show = false;
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
                },_self.options.timeout);
            }
        }
    };

    var notify = new NotifyFactory();

    $rootScope.ngp.notify = notify;

    return notify;
}