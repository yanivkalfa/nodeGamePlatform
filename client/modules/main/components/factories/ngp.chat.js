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

        createRoom : function(room){
            return new this.Room(room);
        },

        indexOf : function(room){
            return UtilFunc.indexOf($rootScope.ngp.rooms, room, 'id');
        },

        getActiveRoom : function(){
            if(!_.isArray($rootScope.ngp.rooms)) return false;

            for(var i = 0; i < $rootScope.ngp.rooms.length; i++){
                if($rootScope.ngp.rooms[i].active) return i;
            }

            return -1;
        },

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
            $rootScope.ngp.rooms[index].content.msg.push(msg);
            self.updateRoomsNotification(index);
            return true;
        },

        removeMsg : function(msg, room){
            var cIndex = UtilFunc.indexOf($rootScope.ngp.rooms, room, 'id');
            if(cIndex == -1) return false;
            var mIndex = UtilFunc.indexOf($rootScope.ngp.rooms[cIndex].content.msg, msg, 'id');
            if(mIndex == -1) return false;
            $rootScope.ngp.rooms[cIndex].content.msg.splice(mIndex,1);
            return true;
        },

        updateRoomsNotification : function(index, msg){
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
            var mIndex = UtilFunc.indexOf($rootScope.ngp.rooms[cIndex].content.users, member, 'id');
            if(mIndex != -1) return false;
            $rootScope.ngp.rooms[cIndex].content.users.push(member);
            return true;
        },

        removeMember : function(member,room){
            var cIndex = UtilFunc.indexOf($rootScope.ngp.rooms, room, 'id');
            if(cIndex == -1) return false;
            var mIndex = UtilFunc.indexOf($rootScope.ngp.rooms[cIndex].content.users, member, 'id');
            if(mIndex == -1) return false;
            $rootScope.ngp.rooms[cIndex].content.users.splice(mIndex,1);
            return true;
        },

        resetNotification : function(index){
            $rootScope.ngp.rooms[index].notification = '';
        },

        addNotification : function(index){
            if(!$rootScope.ngp.rooms[index].notification) $rootScope.ngp.rooms[index].notification = 0;
            $rootScope.ngp.rooms[index].notification++;
        },

        Room : function(room){

            function Room (room){
                this.id = room.id;
                this.title = room.id;
                this.content = {
                    msg : [],
                    users : _.isArray(room.users) ? room.users : [room.users]
                };
                this.active = false;
                this.scrollFlag = true;
                this.msgWrap = undefined;

            }

            Room.prototype =  {
                scrollBottom : function(){
                    console.log(this.msgWrap.scrollTop, this.msgWrap.scrollHeight, this.msgWrap.offsetHeight);
                    this.msgWrap.scrollTop = this.msgWrap.scrollHeight;
                    //this.msgWrap.scrollbot = this.msgWrap.scrollHeight;
                },
                updateScroll : function(){
                    if(this.scrollFlag){
                        this.scrollBottom();
                    }
                }
            };
            return new Room(room);
        }

    };

    return new ChatFactory();
}