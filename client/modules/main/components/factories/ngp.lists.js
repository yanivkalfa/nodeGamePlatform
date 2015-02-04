/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
angular.module(ngp.const.app.name)
    .factory('Lists', [
        Lists
    ]);

function Lists() {

    function ListsFactory(){
        this.Lists = {};
    }

    ListsFactory.prototype.add =  function(l, id){
        console.log('add', arguments);
        var self = this, lId;
        lId = id || l.id;
        if(self.Lists.hasOwnProperty(lId)) return false;
        return self.Lists[lId] = l;
    };

    ListsFactory.prototype.update =  function(l, id){
        var self = this, lId;
        lId = id || l.id;
        if(!self.Lists.hasOwnProperty(lId)) return false;
        return self.Lists[lId] = l;
    };

    ListsFactory.prototype.remove =  function(id){
        var self = this;
        if(_.isEmpty(self.Lists[id])) return false;
        return delete self.Lists[id];
    };

    ListsFactory.prototype.get =  function(id){
        var self = this;
        if(!id) return self.Lists;
        if(_.isEmpty(self.Lists[id])) return false;
        return self.Lists[id];
    };

    ListsFactory.prototype.getByPropName =  function(prop, name){
        var self = this, list;
        for(var id in self.Lists){
            if(!self.Lists.hasOwnProperty(id)) continue;
            if(name == self.Lists[id][prop]) list = self.Lists[id];
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

        while(!_.isEmpty(self.Lists[id])){
            id = genRandomId();
        }
        return id;
    };

    return ListsFactory;
}