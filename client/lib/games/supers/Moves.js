(function(){

    /**
     *
     * @param {Game} game
     * @param {Entity} entity
     * @api public
     */
    function Moves(game, entity){


        /**
         * Holds ref to game object
         *
         * @type {Game}
         * @api public
         */
        this.game = game || {};


        /**
         * Holds ref to entity object
         *
         * @type {Entity}
         * @api public
         */
        this.entity = entity || {};
    }


    /**
     * Gets move distance after calculating velocity/game speed modifier
     *
     * @return {Number} Distance
     * @api public
     */
    Moves.prototype.getMoveDistance = function(){
        return this.entity.velocityModifier * this.game.cycleTook;
    };


    /**
     * Calculates the next move point
     *
     * @param {Number} x
     * @param {Number} y
     *
     * @return {Point} Next move Point
     * @api public
     */
    Moves.prototype.calculateNextPoint = function(x,y){
        x = this.entity.position.x + x || 0;
        y = this.entity.position.y + y || 0;
        return new window.game.class.Point(x,y);
    };


    /**
     * checks for collision and deal with it
     *
     * @param {Point} nextPoint
     * @param {Number} moveDist
     * @param {Number} movDir
     *
     * @return {Object} Containing x and y after collision changes
     * @api public
     */
    Moves.prototype.checkForCollision = function(nextPoint, moveDist, movDir){
        return this.entity.collision.check(nextPoint, moveDist, movDir);
    };


    /**
     * adds next point to current position
     *
     * @param {Number} x
     * @param {Number} y
     *
     * @api public
     */
    Moves.prototype.move = function(x,y){
        this.entity.position.x += x;
        this.entity.position.y += y;
    };


    /**
     * adds Entity to renderer
     *
     * @api public
     */
    Moves.prototype.addToRenderer = function(){
        this.game.renderer.add(this.entity);
    };


    /**
     * Moves entity by vector
     *
     *
     * @param {Vector} vector
     * @api public
     */
    Moves.prototype.moveVector = function(vector){
        var moveDist,nextPoint, moveTo;

        moveDist = this.getMoveDistance();
        nextPoint = this.calculateNextPoint(vector.x, vector.y);
        moveTo = this.checkForCollision(nextPoint, moveDist, +5);
        if(moveTo){
            this.move(moveTo.x, moveTo.y);
            this.addToRenderer();
        }
    };


    /**
     * Moves entity in the up direction
     *
     * @api public
     */
    Moves.prototype.moveUp = function(){
        var moveDist,nextPoint, moveTo;

        moveDist = this.getMoveDistance();
        nextPoint = this.calculateNextPoint(0, -5);
        moveTo = this.checkForCollision(nextPoint, moveDist, -5);
        if(moveTo){
            this.move(moveTo.x, moveTo.y);
            this.addToRenderer();
        }
    };


    /**
     * Moves entity in the down direction
     *
     * @api public
     */
    Moves.prototype.moveDown = function(){
        var moveDist,nextPoint, moveTo;

        moveDist = this.getMoveDistance();
        nextPoint = this.calculateNextPoint(0, 5);
        moveTo = this.checkForCollision(nextPoint, moveDist, +5);
        if(moveTo){
            this.move(moveTo.x, moveTo.y);
            this.addToRenderer();
        }
    };


    /**
     * Moves entity in the right direction
     *
     * @api public
     */
    Moves.prototype.moveRight = function(){
        var moveDist,nextPoint, moveTo;

        moveDist = this.getMoveDistance();
        nextPoint = this.calculateNextPoint(5, 0);
        moveTo = this.checkForCollision(nextPoint, moveDist, +5);
        if(moveTo){
            this.move(moveTo.x, moveTo.y);
            this.addToRenderer();
        }
    };


    /**
     * Moves entity in the left direction
     *
     * @api public
     */
    Moves.prototype.moveLeft = function(){
        var moveDist,nextPoint, moveTo;

        moveDist = this.getMoveDistance();
        nextPoint = this.calculateNextPoint(-5, 0);
        moveTo = this.checkForCollision(nextPoint, moveDist, -5);
        if(moveTo){
            this.move(moveTo.x, moveTo.y);
            this.addToRenderer();
        }
    };


    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.Moves = Moves;
})();