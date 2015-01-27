module.exports = function(_s){

    function Server (){}

    Server.prototype =  {

        fetchByName : function(name){
            return new _s.oReq.Promise(function(resolve, reject) {
                Servers.findOne({name : name}).exec(function (err, user) {
                    if(err) return reject(err);
                    return resolve(user);
                });
            });
        }
    };


    return Server;
};