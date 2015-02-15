(function(){


    /**
     * Renders the graphics for added entities.
     *
     * @param {Boolean} unique ref
     * @extends Collection
     * @api public
     */
    function Renderer(unique){
        window.game.class.Collection.apply(this,arguments);
    }

    Renderer.prototype = Object.create(window.game.class.Collection.prototype);
    Renderer.prototype.constructor = Renderer;


    /**
     * Renders added entities and removes them ones done
     *
     * @override
     * @api public
     */
    Renderer.prototype.add = function(entity){
        entity.needRendering = true;
        return window.game.class.Collection.prototype.add.apply(this, arguments);
    };


    /**
     * Renders added entities and removes them ones done
     *
     * @override
     * @api public
     */
    Renderer.prototype.remove = function(entity){
        entity.needRendering = false;
    };


    /**
     * Renders added entities and removes them ones done
     *
     * @api public
     */
    Renderer.prototype.render = function(){
        var i, l
            , needRendering
            ;

        needRendering = this.get();
        i = 0;
        l = needRendering.length;

        for (i; i < l; i++) {
            needRendering[i].needRendering && needRendering[i].render();
            this.remove(needRendering[i]);
        }
    };

    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.Renderer = Renderer;
})();
