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
                    console.log('scrollHeight', this.msgWrap.scrollHeight);

                    console.log('scrollTop', this.msgWrap.scrollTop);
                    this.msgWrap.scrollTop = this.msgWrap.scrollHeight;
                },
                updateScroll : function(){
                    if(this.scrollFlag){
                        this.scrollBottom();
                    }
                }
            };
            return Room;
        }
    };

    return new UtilFuncFactory();
}