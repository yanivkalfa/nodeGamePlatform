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

        joinRoom : function(room){
            var index = UtilFunc.indexOf($rootScope.ngp.rooms, room, 'id');
            if(index != -1) return false;
            $rootScope.ngp.rooms.push(room);

            return true;
        },

        leaveRoom : function(room){
            var index = UtilFunc.indexOf($rootScope.ngp.rooms, room, 'id');
            if(index == -1) return false;
            $rootScope.ngp.rooms.splice(index,1);

            return true;
        },

        addMsg : function(msg, room){
            var self = this;
            var index = UtilFunc.indexOf($rootScope.ngp.rooms, room, 'id');
            if(index == -1) return false;
            $rootScope.ngp.rooms[index].msg.push(msg);
            self.updateRoomsNotification(index);
            return true;
        },

        removeMsg : function(msg, room){
            var cIndex = UtilFunc.indexOf($rootScope.ngp.rooms, room, 'id');
            if(cIndex == -1) return false;
            var mIndex = UtilFunc.indexOf($rootScope.ngp.rooms[cIndex].msg, msg, 'date');
            if(mIndex == -1) return false;
            $rootScope.ngp.rooms[cIndex].msg.splice(mIndex,1);
            return true;
        },

        updateRoomsNotification : function(index){
            var self = this;
            if(!$rootScope.ngp.rooms[index].active) {
                self.addNotification(index);
                var notification = document.getElementById('notification');
                notification.currentTime = 0;
                notification.play();
            }
        },

        addMember : function(member,room){
            var cIndex = UtilFunc.indexOf($rootScope.ngp.rooms, room, 'id');
            if(cIndex == -1) return false;
            var mIndex = UtilFunc.indexOf($rootScope.ngp.rooms[cIndex].members, member, 'id');
            if(mIndex != -1) return false;
            $rootScope.ngp.rooms[cIndex].members.push(member);
            return true;
        },

        removeMember : function(member,room){
            var cIndex = UtilFunc.indexOf($rootScope.ngp.rooms, room, 'id');
            if(cIndex == -1) return false;
            var mIndex = UtilFunc.indexOf($rootScope.ngp.rooms[cIndex].members, member);
            if(mIndex == -1) return false;
            $rootScope.ngp.rooms[cIndex].members.splice(mIndex,1);
            return true;
        },

        resetNotification : function(index){
            $rootScope.ngp.rooms[index].notification = '';
        },

        addNotification : function(index){
            if(!$rootScope.ngp.rooms[index].notification) $rootScope.ngp.rooms[index].notification = 0;
            $rootScope.ngp.rooms[index].notification++;
        }

    };

    return new ChatFactory();
}