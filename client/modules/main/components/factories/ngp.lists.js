/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .factory('Lists', [
        Lists
    ]);

function Lists() {

    function ListsFactory(){
        this.list = {};
        this.length = 0;
    }

    ListsFactory.prototype.add =  function(l, id){
        var self = this, lId;
        lId = id || l.id || false;
        if(!lId) return false;
        if(self.list.hasOwnProperty(lId)) return false;
        this.length++;
        return self.list[lId] = l;
    };

    ListsFactory.prototype.update =  function(l, id){
        var self = this, lId;
        lId = id || l.id;
        if(!self.list.hasOwnProperty(lId)) return false;
        return self.list[lId] = l;
    };

    ListsFactory.prototype.remove =  function(id){
        var self = this;
        if(_.isEmpty(self.list[id])) return false;
        this.length--;
        return delete self.list[id];
    };

    ListsFactory.prototype.get =  function(id){
        var self = this;
        if(!id) return self.list;
        if(_.isEmpty(self.list[id])) return false;
        return self.list[id];
    };

    ListsFactory.prototype.getByPropName =  function(prop, name){
        var self = this, list;
        for(var id in self.list){
            if(!self.list.hasOwnProperty(id)) continue;
            if(name == self.list[id][prop]) list = self.list[id];
            break;
        }

        return list;
    };

    ListsFactory.prototype.createRequestId = function(){
        var genRandomId = function(){
                var start = Math.floor(Math.random()*30000).toString()
                    , dateNow = Date.now().toString()
                    ;
                return start+dateNow
            }
            , self = this
            , id = genRandomId()
            ;

        while(!_.isEmpty(self.list[id])){
            id = genRandomId();
        }
        return id;
    };

    ListsFactory.prototype.listLength = function(){
        var self = this
            , id
            , length = 0
            ;

        if(this.length == Object.getOwnPropertyNames(this.list).length) return this.length;

        for(id in self.list){
            if(!self.list.hasOwnProperty(id)) continue;
            length++;
        }

        return this.length = length;
    };

    return ListsFactory;
}