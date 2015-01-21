/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

angular.module(ngp.const.app.name)
    .factory('UtilFunc', [
        '$rootScope',
        UtilFunc
    ]);

function UtilFunc($rootScope) {


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
        joinChannel : function(channel){
            var index = UtilFunc.indexOf($rootScope.ngp.channels, channel, 'id');
            if(index != -1) return false;
            $rootScope.ngp.channels.push(channel);

            return true;
        },

        leaveChannel : function(channel){
            var index = UtilFunc.indexOf($rootScope.ngp.channels, channel, 'id');
            if(index == -1) return false;
            $rootScope.ngp.channels.splice(index,1);

            return true;
        },

        addMsg : function(msg, channel){
            var index = UtilFunc.indexOf($rootScope.ngp.channels, channel, 'id');
            if(index == -1) return false;
            $rootScope.ngp.channels[index].msg.push(msg);
            return true;
        },

        removeMsg : function(msg, channel){
            var cIndex = UtilFunc.indexOf($rootScope.ngp.channels, channel, 'id');
            if(cIndex == -1) return false;
            var mIndex = UtilFunc.indexOf($rootScope.ngp.channels[cIndex].msg, msg, 'date');
            if(mIndex == -1) return false;
            $rootScope.ngp.channels[cIndex].msg.splice(mIndex,1);
            return true;
        },

        checkChannel : function(){

            /*
            ///notification : 0

            _this.s.oBinds.notification.currentTime = 0;
            _this.s.oBinds.notification.play();

            */
        },

        addMember : function(member,channel){

        },

        removeMember : function(member,channel){

        }

    };

    return new UtilFuncFactory();
}