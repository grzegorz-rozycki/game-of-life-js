'use strict';

var LIFE = (function () {
    var api    = Object.create(null),
        conf   = Object.create(null),
        loop   = Object.create(null),
        gol    = null,
        graph  = null,
        inited = false;

    conf.fps             = 30;
    conf.frameTime       = 1000 / conf.fps;
    conf.rows            = 100;
    conf.columns         = 192;
    conf.seedDensity     = .05; // how many of the cells are alive; percent
    conf.tileSize        = 5;
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
            graph.drawWorld(cells2points());
        }

        loop.frameRequest = window.requestAnimationFrame(step);
    }


    // public methods

    api.seed = function () {
        gol.clearCells();
        gol.setAliveAtRandomCells(Math.floor(conf.rows * conf.columns * conf.seedDensity));
    };

    api.start = function () {
        if (inited && (typeof loop === 'object') && !loop.frameRequest) {
            loop.frameRequest = window.requestAnimationFrame(step);
            loop.lastAction   = Date.now();
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

    api.restart = function () {

        if (!inited) {
            return;
        }

        api.stop();
        api.seed();
        api.start();
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

        loop.lastAction = 0;
        loop.timeout = conf.frameTime;
        loop.frameRequest = null;

        inited = true;
    };

    return Object.freeze(api);
} ());
