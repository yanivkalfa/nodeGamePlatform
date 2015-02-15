(function(){


    /**
     * Loop through collection and invoke function within it
     *
     * @param {Object} opts
     *  - `cycleEvery` {Number} How often cycle will be executed in mili-seconds
     *  -
     *
     * @param {Game} game ref object
     * @extends Loop
     * @api public
     */
    function PongLoop(game , opts){
        window.game.class.Loop.apply(this,arguments);
    }

    PongLoop.prototype = Object.create(window.game.class.Loop.prototype);
    PongLoop.prototype.constructor = PongLoop;



    /**
     * Cycle over added functions
     *
     * @api public
     */
    PongLoop.prototype.cycle = function(){
        var snapShots = this.game.snapShots.get()
            , i, l, future, past
            , uI, uL
            , x1,x2,y1,y2, entity
            ;

        l = snapShots.length;
        i = 0;

        this.now = Date.now() - 20;

        for (i; i < l; i++) {
            past = snapShots[i];
            future = snapShots[i+1];


            uL = past.u.length;
            // we are in between 2 points within our timeframe
            if(this.now >= past.t && this.now <= future.t && uL == future.u.length){
                var nPos = {};
                uI = 0;

                //iterate over update array
                for (uI; uI < uL; uI++) {
                    // entity to update
                    entity = this.game.entities.get(future.u[uI].id);
                    x1 = past.u[uI].p.x;
                    y1 = past.u[uI].p.y;

                    x2 = future.u[uI].p.x;
                    y2 = future.u[uI].p.y;

                    // middle point between the past/future point
                    nPos.x = (x2-x1) * 0.5 + x1;
                    nPos.y = (y2-y1) * 0.5 + y1;

                    // set entity's new pos and render
                    entity.move(nPos);
                    entity.render();

                    //if player score is set and is different from previous value then render and check score.
                    if(future.u[uI].s && past.u[uI].s != future.u[uI].s){
                        entity.attributes.score = past.u[uI].s;
                        this.game.scoreBoard.render();
                        this.game.roles.check();
                    }
                }

            }
        }
    };

    if(!window.game) window.game = {};
    if(!window.game.class) window.game.class = {};
    window.game.class.PongLoop = PongLoop;
})();
