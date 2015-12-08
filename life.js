'use strict';

var LIFE = (function () {
    var api    = Object.create(null),
        conf   = Object.create(null),
        gol    = null,
        graph  = null,
        inited = false;

    conf.rows            = 10;
    conf.columns         = 10;
    conf.tileSize        = 10;
    conf.canvasElementId = '#canvas';

    // private methods

    /**
     * Translates cell matrix to a list of Graphics.Point elements.
     * Creates an array of Point elements containig coordinates of all liging cells
     */
    function cells2points() {
        var pointsList = [],
            i = 0,
            m = 0,
            n = 0;

        for (m = 0; m < gol.rows; m += 1) {

            for (n = 0; n < gol.columns; n += 1) {

                if (gol.isCellAlive(m, n)) {
                    pointsList[i] = new Graphics.Point(m, n);
                    i += 1;
                }
            }
        }

        return pointsList;
    }

    // public methods
    api.step = function () {
        gol.step();
        graph.drawWorld(cells2points());
    };

    api.init = function () {

        if (inited) {
            return;
        }

        gol = new GameOfLife(conf.rows, conf.columns);
        graph = new Graphics();

        graph.tileSize = conf.tileSize;
        graph.mapWidth = conf.columns;
        graph.mapHeight = conf.rows;

        graph.init(conf.canvasElementId);
console.log(Math.floor(conf.rows * conf.columns / 3));
        gol.setAliveAtRandomCells(Math.floor(conf.rows * conf.columns / 3));
    };

    return Object.freeze(api);
} ());
