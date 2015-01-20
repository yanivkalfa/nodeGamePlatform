/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

angular.module(ngp.const.app.name)
    .factory('UtilFunc', [
        UtilFunc
    ]);

function UtilFunc() {


    function UtilFuncFactory(){}

    UtilFuncFactory.prototype =  {

        formatMsgDate : function() {
            moment(new Date(1421700566413)).format('HH:mm:ss')
        }
    };

    return new UtilFuncFactory();
}