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
			
			this.cells[i][j] = 0;	//dead cell
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
	var count 	= 0,
		top 	= (m - 1 >= 0),
		right 	= (n + 1 < this.columns),
		bottom 	= (m + 1 < this.rows),
		left 	= (n - 1 >= 0);
	
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
	if (top && left && this.cells[m + 1][n + 1]) {
		count += 1;
	}
	
	return count;
};

GameOfLife.prototype.setAliveAtRandomCells = function (aliveCellCount) {
	var cellCount = this.rows * this.columns,
		cellValue = 0,
		offset	  = 0,
		i		  = 0,
		m		  = 0,
		n		  = 0,
		mNext	  = 0,
		nNext     = 0;

	if (aliveCellCount <= 0) {
		// nothing to do
		return;
	}
	
	aliveCellCount = Math.min(aliveCellCount, cellCount);
	
	for (i = 0; i < aliveCellCount; i += 1) {
		m = Math.round(Math.random() * (this.rows - 1));
		n = Math.round(Math.random() * (this.columns - 1));
		
		// try to find next free spot
		for (offset = 0; offset < cellCount; offset += 1) {
			nNext = (n + offset) % this.columns;
			mNext = (m + Math.floor(offset / this.rows)) % this.rows;

			cellValue = this.getCellValue(mNext, nNext);
			
			if (cellValue === 0) {
				// cell was dead
				this.setCellAlive(m, n);
				break;
			}
		}
	}
};
