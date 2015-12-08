'use strict';

var LIFE = (function () {
    var api    = Object.create(null),
        conf   = Object.create(null),
        loop   = Object.create(null),
        gol    = null,
        graph  = null,
        inited = false;

    conf.fps             = 10;
    conf.frameTime       = conf.fps / 1000;
    conf.rows            = 10;
    conf.columns         = 100;
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
                    pointsList[i] = new Graphics.Point(n, m);
                    i += 1;
                }
            }
        }

        return pointsList;
    }

    function step() {
        var now = Date.now();

        if (now - loop.lastAction >= loop.timeout) {
            loop.lastAction = now;
            gol.step();
        }

        graph.drawWorld(cells2points());
        loop.frameRequest = window.requestAnimationFrame(step);
    }


    // public methods

    api.start = function () {
        if (typeof loop === 'object' && !loop.frameRequest) {
            loop.frameRequest = window.requestAnimationFrame(step);
        }
    };

    api.stop = function () {
        if (loop.frameRequest) {
            window.cancelAnimationFrame(loop.frameRequest);
            loop.frameRequest = null;
        }
    };

    api.isRunning = function () {
        return (loop.frameRequest !== null);
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
        gol.setAliveAtRandomCells(Math.floor(conf.rows * conf.columns / 3));

        loop.lastAction = 0;
        loop.timeout = conf.frameTime;
        loop.frameRequest = null;

        api.start();
    };

    return Object.freeze(api);
} ());
