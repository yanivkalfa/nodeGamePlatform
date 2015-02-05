module.exports = function(_s){

    var pathsList = _s.oConfig.pathsList
        , User = require(pathsList.User)(_s)
        , _ = _s.oReq.lodash
        ;

    function GetRoom(){
        this.room = {
            id : '',
            title : '',
            content : {
                msg : [],
                users : []
            },
            active : false
        };
        this.roomSparks = [];
        this.sparkList = {};
        this.unique = {};
        this.inSparks = [];
    }

    GetRoom.prototype = {

        getSparksInRoom : function(room){
            return new _s.oReq.Promise(function(resolve, reject) {
                _s.primus.room(room).clients(function(err, sparks){
                    if(err) return reject(err);
                    return resolve(sparks);
                });
            });
        },

        setRoomSparks : function(roomSparks){
            this.roomSparks = roomSparks;
            return this;
        },

        setSparkList : function(){
            var self = this;
            this.roomSparks.forEach(function(spark){
                self.sparkList[spark] = false;
            });
            return this;
        },

        checkUserNameInPrimus : function(){
            var self = this;
            _s.primus.forEach(function (primSpark, next) {
                if(self.sparkList.hasOwnProperty(primSpark.id)){
                    self.sparkList[primSpark.id] = {username : primSpark.user.username, id : primSpark.user.id};
                }
                next();
            }, function (err) {});
            return this;
        },

        setInSpark : function(){
            var self = this;
            _(self.sparkList).forEach(function(spark, sparkId) {
                if(!spark) self.inSparks.push(sparkId);
            });
            return this;
        },

        fetchUsersInSparks : function(){
            var self = this;
            return new _s.oReq.Promise(function(resolve, reject) {
                User.fetchUsers({ 'spark': { $in: self.inSparks }}).then(resolve).catch(reject);
            });
        },

        checkUserNameInDB : function(users){
            if(!_.isArray(users)) return false;
            var self = this;
            users.forEach(function(user){
                if(self.sparkList.hasOwnProperty(user.spark)){
                    self.sparkList[user.spark] = {username : user.username, id : user.id};
                }
            });

            return this;
        },

        cleanSparkList : function(){
            var self = this;
            _(self.sparkList).forEach(function(spark, sparkId) {
                if(!spark) delete self.sparkList[sparkId];
                if(!self.unique[spark.id] ) self.unique[spark.id] = {count:0, sparkId : sparkId};
                self.unique[spark.id].count++;
            });

            _(self.unique).forEach(function(uniqueSpark, index) {
                if(uniqueSpark.count > 1) delete self.sparkList[uniqueSpark.sparkId];
            });

            return this;
        },


        assembleRoom : function(){
            var self = this;
            _(self.sparkList).forEach(function(spark) {
                self.room.content.users.push(spark);
            });

            return this;
        },

        getRoomUsers : function(){
            return this.room.content.users;
        },

        destroy : function(){
            this.room = {
                id : '',
                title : '',
                content : {
                    msg : [],
                    users : []
                },
                active : false
            };
            this.roomSparks = [];
            this.sparkList = {};
            this.unique = {};
            this.inSparks = [];
            return this;
        }
    };

    return GetRoom;

};