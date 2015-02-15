(function(){

    /**
     *
     * @extends Collection
     * @api public
     */
    function KeyBinds(){
        window.game.class.Collection.apply(this,arguments);

        this.init();
    }

    KeyBinds.prototype = Object.create(window.game.class.Collection.prototype);
    KeyBinds.prototype.constructor = KeyBinds;


    KeyBinds.prototype.init = function(){ };


    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.KeyBinds = KeyBinds;
})();