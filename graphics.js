'use strict';

function Graphics() {
    this.ctx = null;
    this.tileSize = 10;
    this.mapWidth = 100;
    this.mapHeight = 100;
    this.backgroundColor = '#BDBDBD';
    this.tileColor = '#000';
}

Graphics.prototype.init = function (canvasSelector) {
    var canvasElement = document.querySelector(canvasSelector);

    return (
        canvasElement instanceof HTMLCanvasElement
        && ((this.ctx = canvasElement.getContext('2d')) !== null)
    );
};

Graphics.prototype.drawTile = function (x, y) {
    this.ctx.fillRect(
        x * this.tileSize + 1,
        y * this.tileSize + 1,
        this.tileSize - 1,
        this.tileSize -1
    );
};

Graphics.prototype.drawWorld = function (cells) {
    var i = null;

    if (!this.ctx || !(cells instanceof Array)) {
        return;
    }

    try {
        this.ctx.save();

        // background
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(
            0,
            0,
            this.mapWidth * this.tileSize,
            this.mapHeight * this.tileSize
        );
        // cells
        this.ctx.fillStyle = this.tileColor;

        for (i = 0; i < cells.length; i += 1) {

            if (cells[i] instanceof Graphics.Point) {
                break;
            }

            if (cells[i].isSet()) {
                this.drawTile(cells[i].x, cells[i].y);
            }
        }


    } finally {
        this.ctx.restore();
    }
};

Graphics.Point = function (x, y) {
    this.x = (typeof x === 'number') ? x : null;
    this.y = (typeof y === 'number') ? y : null;
};

Graphics.Point.prototype.isSet = function () {
    return (this.x !== null && this.y !== null);
};
