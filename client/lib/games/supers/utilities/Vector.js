(function(){
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype = {
        add: function(other) {
            return new Vector(this.x + other.x, this.y + other.y);
        },
        scale: function(by) {
            return new Vector(this.x * by, this.y * by);
        },
        normalize: function() {
            function norm(value) {
                return value > 0 ? 1 : value < 0 ? -1 : 0;
            }
            return new Vector(norm(this.x), norm(this.y));
        }
    };

    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.Vector = Vector;

})();