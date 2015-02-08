(function(){

    function List(){
        this.list = {};
        this.length = 0;
    }

    List.prototype.add =  function(l, id){
        var self = this, lId;
        lId = id || l.id || l._id ||false;
        if(!lId) return false;
        if(self.list.hasOwnProperty(lId)) return false;
        this.length++;
        return self.list[lId] = l;
    };

    List.prototype.update =  function(l, id){
        var self = this, lId;
        lId = id || l.id;
        if(!self.list.hasOwnProperty(lId)) return false;
        return self.list[lId] = l;
    };

    List.prototype.remove =  function(id){
        var self = this;
        if(_.isEmpty(self.list[id])) return false;
        this.length--;
        return delete self.list[id];
    };

    List.prototype.clear =  function(id){
        var self = this;
        return self.list = {};
    };

    List.prototype.get =  function(id){
        var self = this;
        if(!id) return self.list;
        if(_.isEmpty(self.list[id])) return false;
        return self.list[id];
    };

    List.prototype.getByPropName =  function(prop, val){
        var self = this;
        for(var id in self.list){
            if(!self.list.hasOwnProperty(id)) continue;
            if(val == self.list[id][prop]) return self.list[id];
        }
    };

    List.prototype.createRequestId = function(){
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

    List.prototype.listLength = function(){
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

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = List
    }else{
        if(window.ngp)
            if(window.ngp.oFns)window.ngp.oFns.List = List;
            else{
                window.ngp.oFns = {
                    List:List
                };
            }
    }
})();