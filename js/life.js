'use strict';

var LIFE = (function ($) {
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
    conf.seedDensity     = .1; // how many of the cells are alive; percent
    conf.tileSize        = 5;

    // dom element selectors
    conf.selector = Object.create(null);

    conf.selector.canvas        = 'canvas';
    conf.selector.playPause     = '#play-pause';
    conf.selector.playPauseIcon = '#play-pause > span';
    conf.selector.restart       = '#restart';

    conf.cssClass = Object.create(null);

    conf.cssClass.play  = 'glyphicon-play';
    conf.cssClass.pause = 'glyphicon-pause';
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

    api.getSeedDensity = function () {
        return conf.seedDensity;
    };

    api.setSeedDensity = function (seed) {

        if (seed > 0 && seed <= 1) {
            conf.seedDensity = Math.round(seed * 100) / 100;

            return true;
        }

        return false;
    };

    api.seed = function () {
        gol.clearCells();
        gol.setAliveAtRandomCells(Math.floor(conf.rows * conf.columns * conf.seedDensity));
    };

    api.clear = function () {
        gol.clearCells();
        graph.drawWorld(cells2points());
    };

    api.start = function () {
        var elm = null;

        if (inited && (typeof loop === 'object') && !loop.frameRequest) {
            loop.frameRequest = window.requestAnimationFrame(step);
            loop.lastAction   = Date.now();

            elm = $(conf.selector.playPauseIcon);
            elm.removeClass(conf.cssClass.play)
            elm.addClass(conf.cssClass.pause);
        }
    };

    api.stop = function () {
        var elm = null;

        if (loop.frameRequest) {
            window.cancelAnimationFrame(loop.frameRequest);
            loop.frameRequest = null;

            elm = $(conf.selector.playPauseIcon);
            elm.removeClass(conf.cssClass.pause)
            elm.addClass(conf.cssClass.play);
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

    api.playPause = function () {

        if (api.isRunning()) {
            api.stop();
        } else {
            api.start();
        }
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

        graph.init(conf.selector.canvas);

        loop.lastAction = 0;
        loop.timeout = conf.frameTime;
        loop.frameRequest = null;

        // bind button actions
        $(conf.selector.playPause).click(api.playPause);
        $(conf.selector.restart).click(api.restart);

        inited = true;
    };

    return Object.freeze(api);
} (jQuery));
