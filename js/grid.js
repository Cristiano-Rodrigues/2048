class Grid {
  constructor(size, grid) {
    this.size = size;
    if (grid) {
      this.cells = this.normalize(grid.cells);
    } else {
      this.cells = this.newCells();
    }
  }
  normalize(cells) {
    let normalized = [];
    for (let y = 0; y < this.size; y++) {
      let line = [];
      for (let x = 0; x < this.size; x++) {
        let cell = cells[y][x];
        if (cell) {
          cell = new Tile(new Vector(x, y), cell.value);
        }
        line.push(cell);
      }
      normalized.push(line);
    }
    return normalized;
  }
  newCells() {
    let grid = [];
    for (let y = 0; y < this.size; y++) {
      let line = [];
      for (let x = 0; x < this.size; x++) {
        line.push(null);
      }
      grid.push(line);
    }
    return grid;
  }
  addTileRandomly() {
    let empty = this.getEmptyCells();
    if (empty) {
      let random = Math.floor(Math.random() * empty.length);
      let space = empty[random];
      this.set(space, new Tile(space));
    }
  }
  getEmptyCells() {
    let empty = [];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let cell = this.get(new Vector(x, y));
        if (cell == null) {
          empty.push(new Vector(x, y));
        }
      }
    }
    return empty.length > 0 ? empty : null;
  }
  isInside(pos) {
    return pos.x >= 0 && pos.x < this.size &&
           pos.y >= 0 && pos.y < this.size;
  }
  moveAvailable(destination) {
    return this.isInside(destination) &&
           this.get(destination) === null;
  }
  each(f, context) {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let cell = this.get(new Vector(x, y));
        if (cell != null) {
          f.call(context, cell, x, y);
        }
      }
    }
  }
  some(f, context) {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let cell = this.get(new Vector(x, y));
        if (cell != null && f.call(context, cell, x, y)) {
          return true;
        }
      }
    }
    return false;
  }
  mergesAvailable() {
    let directions = {
      up: new Vector(0, -1),
      right: new Vector(1, 0),
      down: new Vector(0, 1),
      left: new Vector(-1, 0)
    }
    let names = Object.keys(directions);

    return this.some(function(tile) {
      for (let count = 0; count < names.length; count++) {
        let direction = names[count];
        let destination = tile.pos.plus(directions[direction]);
        let other;

        if (this.isInside(destination) &&
            (other = this.get(destination)) &&
            other.value == tile.value) {
          return true;
        }
      }
    }, this);
  }
  get(pos) {
    return this.cells[pos.y][pos.x];
  }
  set(pos, value) {
    this.cells[pos.y][pos.x] = value;
  }
}