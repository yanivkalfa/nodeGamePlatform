/**
 * Created by Yaniv-Kalfa on 1/2/15.
 */
(function(){
    angular.module(ngp.const.app.name)
        .factory('List', [
            List
        ]);

    function List() {

        function ListFactory(){
            this.list = {};
            this.length = 0;
        }

        ListFactory.prototype.add =  function(l, id){
            var self = this, lId;
            lId = id || l.id || false;
            if(!lId) return false;
            if(self.list.hasOwnProperty(lId)) return false;
            this.length++;
            return self.list[lId] = l;
        };

        ListFactory.prototype.update =  function(l, id){
            var self = this, lId;
            lId = id || l.id;
            if(!self.list.hasOwnProperty(lId)) return false;
            return self.list[lId] = l;
        };

        ListFactory.prototype.remove =  function(id){
            var self = this;
            if(_.isEmpty(self.list[id])) return false;
            this.length--;
            return delete self.list[id];
        };

        ListFactory.prototype.get =  function(id){
            var self = this;
            if(!id) return self.list;
            if(_.isEmpty(self.list[id])) return false;
            return self.list[id];
        };

        ListFactory.prototype.getByPropName =  function(prop, name){
            var self = this, list;
            for(var id in self.list){
                if(!self.list.hasOwnProperty(id)) continue;
                if(name == self.list[id][prop]) list = self.list[id];
                break;
            }

            return list;
        };

        ListFactory.prototype.createRequestId = function(){
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

        ListFactory.prototype.listLength = function(){
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

        return ListFactory;
    }
})();