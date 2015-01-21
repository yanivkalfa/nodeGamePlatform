/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */

angular.module(ngp.const.app.name)
    .factory('Chat', [
        '$rootScope',
        'UtilFunc',
        Chat
    ]);

function Chat($rootScope, UtilFunc) {


    function ChatFactory(){}

    ChatFactory.prototype =  {

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
            var self = this;
            var index = UtilFunc.indexOf($rootScope.ngp.channels, channel, 'id');
            if(index == -1) return false;
            $rootScope.ngp.channels[index].msg.push(msg);
            self.updateChannelsNotification(index);
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

        updateChannelsNotification : function(index){
            var self = this;
            if(!$rootScope.ngp.channels[index].active) {
                self.addNotification(index);
                var notification = document.getElementById('notification');
                notification.currentTime = 0;
                notification.play();
            }
        },

        addMember : function(member,channel){
            var index = UtilFunc.indexOf($rootScope.ngp.channels, channel, 'id');
            if(index == -1) return false;
            $rootScope.ngp.channels[index].members.push(member);
            return true;
        },

        removeMember : function(member,channel){
            var cIndex = UtilFunc.indexOf($rootScope.ngp.channels, channel, 'id');
            if(cIndex == -1) return false;
            var mIndex = UtilFunc.indexOf($rootScope.ngp.channels[cIndex].members, member);
            if(mIndex == -1) return false;
            $rootScope.ngp.channels[cIndex].members.splice(mIndex,1);
            return true;
        },

        resetNotification : function(index){
            $rootScope.ngp.channels[index].notification = '';
        },

        addNotification : function(index){
            if(!$rootScope.ngp.channels[index].notification) $rootScope.ngp.channels[index].notification = 0;
            $rootScope.ngp.channels[index].notification++;
        }

    };

    return new ChatFactory();
}