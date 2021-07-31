function Grid(size, cells) {
  this.size = size;
  this.cells = (cells && this.normalizeCells(cells))
                    || this.getEmptyCells();
  this.cells[0][0] = new Block(new Vector(0, 0));
}

Grid.prototype.getEmptyCells = function() {
  const emptyCells = [];
  for (let y = 0; y < this.size; y++)
    emptyCells.push(new Array(this.size).fill(0))

  return emptyCells;
}

Grid.prototype.each = function(action, context) {
  for (let y = 0; y < this.size; y++) {
    for (let x = 0; x < this.size; x++) {
      const cell = this.getContent(new Vector(x, y));
      if (cell instanceof Block)
        action.call(context, cell);
    }
  }
}

Grid.prototype.getContent = function(position) {
  return this.cells[position.y][position.x];
}