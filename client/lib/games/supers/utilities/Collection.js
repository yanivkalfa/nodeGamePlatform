(function(){
    function Collection(unique){
        this.collection = [];
        this.unique = unique || false;
    }

    Collection.prototype.add =  function(item){
        if(this.unique){
            var index = this.collection.indexOf(item);
            if(index > -1) return false;
        }
        return this.collection.push(item);
    };

    Collection.prototype.update =  function(item){
        var index = this.collection.indexOf(item);
        if(index <= -1) return false;
        this.collection[index] = item;
    };

    Collection.prototype.remove =  function(item){
        var index = this.collection.indexOf(item);
        if(index <= -1) return false;
        this.collection.splice(index,1);
    };

    Collection.prototype.clear =  function(){
        this.collection = [];
    };

    Collection.prototype.get =  function(item){
        if(!item) return this.collection;
        var index = this.collection.indexOf(item);
        if(index <= -1) return false;
        return this.collection[index];
    };

    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.Collection = Collection;

})();