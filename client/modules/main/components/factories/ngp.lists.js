/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .factory('Lists', [
        Lists
    ]);

function Lists() {

    function ListsFactory(){
        this.lists = {};
    }

    ListsFactory.prototype.add =  function(l, id){
        console.log('add', arguments);
        var self = this, lId;
        lId = id || l.id;
        if(self.lists.hasOwnProperty(lId)) return false;
        return self.lists[lId] = l;
    };

    ListsFactory.prototype.update =  function(l, id){
        var self = this, lId;
        lId = id || l.id;
        if(!self.lists.hasOwnProperty(lId)) return false;
        return self.lists[lId] = l;
    };

    ListsFactory.prototype.remove =  function(id){
        var self = this;
        if(_.isEmpty(self.lists[id])) return false;
        return delete self.lists[id];
    };

    ListsFactory.prototype.get =  function(id){
        var self = this;
        if(!id) return self.lists;
        if(_.isEmpty(self.lists[id])) return false;
        return self.lists[id];
    };

    ListsFactory.prototype.getByPropName =  function(prop, name){
        var self = this, list;
        for(var id in self.lists){
            if(!self.lists.hasOwnProperty(id)) continue;
            if(name == self.lists[id][prop]) list = self.lists[id];
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

        while(!_.isEmpty(self.lists[id])){
            id = genRandomId();
        }
        return id;
    };

    return ListsFactory;
}