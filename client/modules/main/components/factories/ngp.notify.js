/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .factory('Notify', [
            '$rootScope',
            Notify
        ]);

    function Notify(
        $rootScope
        ) {


        function NotifyFactory(){
            this.options = { timeout : 4000 };
            this.reset();
        }

        NotifyFactory.prototype =  {

            reset : function() {
                this.msg = '';
                this.class = 'notify-success';
                this.show = false;
            },

            success : function() {
                this.class = 'notify-success';
                this.message(arguments);
            },
            error : function() {
                this.class = 'notify-failed';
                this.message(arguments);
            },
            warning : function() {
                this.class = 'notify-warning';
                this.message(arguments);
            },
            message : function(args) {
                var _self = this;

                this.msg = Array.prototype.join.apply(args, [' ']);
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
})();