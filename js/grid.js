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
      const cell = this.get(new Vector(x, y));
      if (cell instanceof Block)
        action.call(context, cell);
    }
  }
}

Grid.prototype.get = function(position) {
  return this.cells[position.y][position.x];
}

Grid.prototype.addRandomBlock = function() {
  const space = this.getRandomEmptyCell();

  this.set(space, new Block(space));
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
      const cell = this.get(new Vector(x, y));
      if (cell === null)
        emptyCells.push(new Vector(x, y));
    }
  }

  return emptyCells;
}

Grid.prototype.set = function(position, value) {
  this.cells[position.y][position.x] = value;
}

Grid.prototype.move = function(block, destination) {
  this.set(block.position, null);
  this.set(destination, block);
  block.moved = true;
  block.position = destination;
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
  return this.get(destination) !== null;
}

Grid.prototype.some = function(f, context) {
  for (let y = 0; y < this.size; y++) {
    for (let x = 0; x < this.size; x++) {
      const cell = this.get(new Vector(x, y));
      if (cell instanceof Block &&
          f.call(context, cell))
        return true;
    }
  }
  return false;
}

Grid.prototype.mergeAndReturn = function(block, other) {
  this.set(block.position, null);
  this.set(other.position, 
           merged = new Block(other.position,
                              block.value * 2));
  merged.merged = merged.moved = true;

  return merged;
}

Grid.prototype.mergesAvailable = function() {
  const directions = {
    up    : new Vector( 0, -1 ),
    right : new Vector( 1,  0 ),
    down  : new Vector( 0,  1 ),
    left  : new Vector(-1,  0 )
  }
  const map = "up right down left".split(" ");

  return this.some(function(block){
    for (let i = 0; i < map.length; i++) {
      const direction = map[ i ];
      const destination = block.position.plus(directions[direction]);
      let other;

      if (this.isInside(destination) &&
          (other = this.get(destination)) &&
          other.value == block.value)
        return true;
    }
  }, this);
}

function Vector(x, y) {
  this.x = x; this.y = y;
}

Vector.prototype.plus = function(vector) {
  return new Vector(this.x + vector.x,
                    this.y + vector.y);
}