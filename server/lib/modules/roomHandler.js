module.exports = function(_s, _rf){

    var _ = _s.oReq.lodash;

    return {
        joinRoom : function(room,user){
            if(!_.isArray(user.rooms)) return false;
            var index = user.rooms.indexOf(room);
            if(index != -1) return false;
            user.rooms.push(room);

            return new _s.oReq.Promise(function(resolve, reject) {
                user.save(function (err, user) {
                    if(err) reject(err);
                    return resolve(user);
                });
            });

        },

        leaveRoom : function(room,user){
            if(!_.isArray(user.rooms)) return false;
            var index = user.rooms.indexOf(room);
            if(index == -1) return false;
            user.rooms.splice(index,1);

            return new _s.oReq.Promise(function(resolve, reject) {
                user.save(function (err, user) {
                    if(err) reject(err);
                    return resolve(user);
                });
            });

        }
    }

};