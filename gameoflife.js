'use strict';

function GameOfLife(rows, columns) {
    this.rows = (rows >= 1) ? rows : 1;
    this.columns = (columns >= 1) ? columns : 1;
    this.cells = [];

    this.clearCells();
}

GameOfLife.prototype.clearCells = function () {
    var i,j;

    this.cells = this.cells || [];

    for (i = 0; i < this.rows; i++) {

        this.cells[i] = this.cells[i] || [];

        for (j = 0; j < this.columns; j++) {

            this.cells[i][j] = 0;   //dead cell
        }
    }
};

GameOfLife.prototype.getCellValue = function (m, n) {
    if (m >= 0 && n >= 0 && m < this.rows && n < this.columns) {
        // in bounds
        return this.cells[m][n];
    } // else returns undefined
};

GameOfLife.prototype.setCellDead = function (m, n) {
    if (this.getCellValue(m, n) !== undefined) {
        this.cells[m][n] = 0;
    }
}

GameOfLife.prototype.setCellAlive = function (m, n) {
    if (this.getCellValue(m, n) !== undefined) {
        this.cells[m][n] = 1;
    }
}


GameOfLife.prototype.isCellAlive = function (m, n) {
    var value = this.getCellValue(m, n);

    if (value !== undefined) {
        return (value !== 0);
    } // else returns undefined
}

GameOfLife.prototype.countNeighbours = function (m, n) {
    var count   = 0,
        top     = (m - 1 >= 0),
        right   = (n + 1 < this.columns),
        bottom  = (m + 1 < this.rows),
        left    = (n - 1 >= 0);

    if (m < 0 || n < 0 || m >= this.rows || n >= this.columns) {
        // out of bounds
        return -1;
    }

    if (!(top || right || bottom || left)) {
        // no neighbours
        return 0;
    }

    // top left corner
    if (top && left && this.cells[m - 1][n - 1]) {
        count += 1;
    }

    // top center
    if (top && this.cells[m - 1][n]) {
        count += 1;
    }

    // top right
    if (top && right && this.cells[m - 1][n + 1]) {
        count += 1;
    }

    // left
    if (left && this.cells[m][n - 1]) {
        count += 1;
    }

    // right
    if (right && this.cells[m][n + 1]) {
        count += 1;
    }

    // bottom left
    if (bottom && left && this.cells[m + 1][n - 1]) {
        count += 1;
    }

    // bottom
    if (bottom && this.cells[m + 1][n]) {
        count += 1;
    }

    // bottom right
    if (bottom && right && this.cells[m + 1][n + 1]) {
        count += 1;
    }

    return count;
};

GameOfLife.prototype.setAliveAtRandomCells = function (aliveCellCount) {
    var cellCount = this.rows * this.columns,
        cellValue = 0,
        i         = 0,
        j         = 0,
        mOffset   = 0,
        m         = 0,
        n         = 0;

    if (aliveCellCount <= 0) {
        // nothing to do
        return;
    }

    aliveCellCount = Math.min(aliveCellCount, cellCount);

    for (i = 0; i < aliveCellCount; i += 1) {
        m = mOffset = Math.round(Math.random() * (this.rows - 1));
        n = Math.round(Math.random() * (this.columns - 1));

        // try to find next free spot
        for (j = 0; j < cellCount; j += 1) {
            cellValue = this.getCellValue(m, n);

            if (cellValue === 0) {
                // cell was dead
                this.setCellAlive(m, n);
                break;
            }

            n = ++n % this.columns;
            m = (mOffset + Math.floor(j / this.rows)) % this.rows;
        }
    }
};

GameOfLife.prototype.step = function () {
    var neighbours = 0,
        alive      = false,
        m          = 0,
        n          = 0;

    for (m = 0; m < this.rows; m += 1) {

        for (n = 0; n < this.columns; n += 1) {
            neighbours = this.countNeighbours(m, n);
            alive = this.isCellAlive(m, n);

            if (!alive && neighbours === 3) {
                // if cell is dead and has exactyl 3 neighbours make cell alive
                this.setCellAlive(m, n);
            } else if (alive && neighbours !== 2 && neighbours !== 3) {
                // if cell is alive and has number of neighbours other than 2 or 3 dies
                this.setCellDead(m, n);
            }

        }
    }
};

GameOfLife.prototype.toString = function () {
    var str = '',
        m   = 0,
        n   = 0;

    for (m = 0; m < this.rows; m += 1) {

        for (n = 0; n < this.columns; n += 1) {
            str += this.cells[m][n] + "\t";
        }

        str += "\n";
    }

    return str;
};
