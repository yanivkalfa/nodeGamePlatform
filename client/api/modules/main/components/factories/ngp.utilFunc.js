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

        formatMsgDate : function(unixDate) { return moment(new Date(unixDate)).format('HH:mm:ss'); }

    };

    return new UtilFuncFactory();
}