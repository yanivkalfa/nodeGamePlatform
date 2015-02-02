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

        formatMsgDate : function(unixDate) { return moment(new Date(unixDate)).format('HH:mm:ss'); },

        indexOf : function(thisArg, index, prop){
            var self = this;
            return self.findIndex.call(thisArg, index, prop);
        },

        findIndex : function(index, prop){
            for(var i = 0; i < this.length; i++){
                if(prop) if(this[i][prop] == index || this[i][prop] == index[prop]) return i;
                if(this[i] == index) return i;
            }
            return -1;
        },

        toArray : function(item){
            return !_.isArray(item) ? [item] : item;
        }
    };

    return new UtilFuncFactory();
}