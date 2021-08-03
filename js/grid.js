function Grid(size, cells) {
  this.size = size;
  this.cells = (cells && this.normalizeCells(cells))
                    || this.getEmptyGrid();
}

Grid.prototype.getEmptyGrid = function() {
  const emptyGrid = [];
  for (let y = 0; y < this.size; y++)
    emptyGrid.push(new Array(this.size).fill(null));

  return emptyGrid;
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

Grid.prototype.addRandomBlock = function() {
  const space = this.getRandomEmptyCell();

  this.setContent(space, new Block(space));
}

Grid.prototype.getRandomEmptyCell = function() {
  const emptyCells = this.getEmptyCells();

  return emptyCells[ Math.floor(Math.random() *
                        emptyCells.length) ];
}

Grid.prototype.getEmptyCells = function() {
  const emptyCells = [];

  for (let y = 0; y < this.size; y++) {
    for (let x = 0; x < this.size; x++) {
      const cell = this.getContent(new Vector(x, y));
      if (cell === null)
        emptyCells.push(new Vector(x, y));
    }
  }

  return emptyCells;
}

Grid.prototype.setContent = function(position, value) {
  this.cells[position.y][position.x] = value;
}

Grid.prototype.moveAndReturn = function(block, destination) {

  this.setContent(block.position, null);
  this.setContent(destination, block = new Block(destination,
                                                 block.value));

  return block;
}

Grid.prototype.moveAvailable = function(destination) {
  return this.isInside(destination) &&
         !this.isOcuppied(destination);
}

Grid.prototype.isInside = function(destination) {
  return destination.x >= 0 && destination.x < this.size &&
         destination.y >= 0 && destination.y < this.size;
}

Grid.prototype.isOcuppied = function(destination) {
  return this.getContent(destination) !== null;
}

function Vector(x, y) {
  this.x = x; this.y = y;
}

Vector.prototype.plus = function(vector) {
  return new Vector(this.x + vector.x,
                    this.y + vector.y);
}