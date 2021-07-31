function Grid(size, cells) {
  this.size = size;
  this.cells = (cells && this.normalizeCells(cells))
                    || this.getEmptyCells();
}

Grid.prototype.getEmptyCells = function() {
  const emptyCells = [];
  for (let y = 0; y < this.size; y++)
    emptyCells.push(new Array(this.size).fill(null))

  return emptyCells;
}