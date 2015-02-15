(function(){
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype = {
        relative: function(to) {
            return new window.game.class.Vector(to.x - this.x, to.y - this.y);
        },
        distance: function(to) {
            return Math.sqrt(Math.pow(this.x - to.x, 2) + Math.pow(this.y - to.y, 2));
        }
    };

    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.Point = Point;

})();