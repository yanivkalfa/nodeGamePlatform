(function(){
    var List;
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = UsersList;
        List = require('./list.js');
    }else{
        if(window.ngp)
            if(window.ngp.oFns)window.ngp.oFns.UsersList = UsersList;
            else{
                window.ngp.oFns = {
                    UsersList:UsersList
                };
            }
        List = window.ngp.oFns.List;
    }

    function UsersList(){
        List.apply(this, arguments);
    }

    UsersList.prototype = Object.create(List.prototype);
    UsersList.prototype.constructor = UsersList;

    UsersList.prototype.getMyIndex = function(){
        var self = this
            , id
            ;

        for(id in self.list){
            if(!self.list.hasOwnProperty(id)) continue;
            if(self.list[id].isMe) return id;
        }

        return -1;
    };

    UsersList.prototype.accept = function(user){
        var self = this, u;
        u = self.get(user.id);
        if(!u) return false;
        return u.accepted = true;
    };

    UsersList.prototype.decline = function(user){
        var self = this, u;
        u = self.get(user.id);
        if(!u) return false;
        return u.accepted = false;
    };
})();
